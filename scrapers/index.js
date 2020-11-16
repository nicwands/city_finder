import util from 'util'
import puppeteer from 'puppeteer'
import con from '../app/db'
import dashify from 'dashify'
import states from './states'

const query = util.promisify(con.query).bind(con)

;(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    for (let i = 0; i < states.length; i++) {
        await cycleCities(states[i][0], states[i][1], page, async () => {
            await browser.close()
        })
    }
})()

const cycleCities = async (fullState, abbrState, page, callback) => {
    // Get weather data for individual city
    await query('SELECT id, name FROM city WHERE state = ?;', [abbrState], async (err, rows, fields) => {
        if (err) console.error(err)

        let addedCounter = 0
        for (let i = 0; i < rows.length; i++) {
            const cityName = dashify(rows[i].name)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            const stateName = dashify(fullState)
            const url = `https://www.usclimatedata.com/climate/${cityName}/${stateName}/united-states/`
            await page.goto(url)
            const data = await getWeatherForCity(page, cityName, stateName)
            console.log(rows[i].name, ', ', fullState, ': ', data)

            if (data !== null) {
                addedCounter++
                const queryString =
                    'UPDATE city SET winter_high = ?, winter_low = ?, summer_high = ?, summer_low = ?, precipitation = ? where id = ?;'
                await query(queryString, [
                    data.winter.high,
                    data.winter.low,
                    data.summer.high,
                    data.summer.low,
                    data.precipitation,
                    rows[i].id
                ])
                console.log(`Added to DB (${addedCounter})`)
            }
        }

        return callback()
    })
}

const getWeatherForCity = async (page, city, state) => {
    // Check for 404
    if (await page.$('.error_pages')) return null

    // Check for auto redirect
    if (page.url().split('/')[4] !== city || page.url().split('/')[5] !== state) {
        return null
    }

    const monthlyTableOne = await page.$eval('#monthly_table_one', (element) => element.innerHTML)
    const monthlyTableTwo = await page.$eval('#monthly_table_two', (element) => element.innerHTML)

    const tableOneData = getTemps(monthlyTableOne)
    const allTemps = tableOneData.concat(getTemps(monthlyTableTwo))

    const yearlyPrecip = getPrecip(monthlyTableOne) + getPrecip(monthlyTableTwo)

    let weatherData = {
        winter: {
            high: null,
            low: null
        },
        summer: {
            high: null,
            low: null
        },
        precipitation: null
    }

    // Average high and low of Dec, Jan, Feb
    weatherData.winter.high = Math.floor((allTemps[0] + allTemps[1] + allTemps[17]) / 3)
    weatherData.winter.low = Math.floor((allTemps[6] + allTemps[7] + allTemps[23]) / 3)

    // Average high and low of Jun, Jul, Aug
    weatherData.summer.high = Math.floor((allTemps[5] + allTemps[12] + allTemps[13]) / 3)
    weatherData.summer.low = Math.floor((allTemps[11] + allTemps[18] + allTemps[19]) / 3)

    // Average yearly precipitation
    weatherData.precipitation = parseFloat(yearlyPrecip.toFixed(2))

    return weatherData
}

const getTemps = (table) => {
    const splitTable = table.split('</td>')
    let averageTemps = []

    for (let i = 0; i < 12; i++) {
        const cur = splitTable[i]
        let temp = '0'
        for (let i = cur.length - 3; i < cur.length; i++) {
            if (cur[i] >= '0' && cur[i] <= '9') {
                temp += cur[i]
            }
        }
        averageTemps.push(parseInt(temp))
    }

    return averageTemps
}

const getPrecip = (table) => {
    const splitTable = table.split('<tr>')
    const precipRow = splitTable[4]
    if (precipRow === undefined) return null
    const splitPrecip = precipRow.split('</td>')

    let allPrecip = 0
    for (let i = 0; i < splitPrecip.length - 1; i++) {
        const cur = splitPrecip[i]
        let precip = ''
        for (let i = cur.length - 4; i < cur.length; i++) {
            if ((cur[i] >= '0' && cur[i] <= '9') || cur[i] === '.') {
                precip += cur[i]
            }
        }
        allPrecip += parseFloat(precip)
    }

    return allPrecip
}
