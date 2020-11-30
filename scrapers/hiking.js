import fetch from 'node-fetch'
import queryDB from '../app/db'
import { sleep } from '../utils/helpers'
const queryString = require('query-string')
const colors = require('colors')

const queryAPI = (lat, lon) => {
    const endpoint = process.env.HIKING_URL
    const key = process.env.HIKING_API_KEY
    const maxDistance = process.env.HIKING_MAX_DISTANCE
    const minLength = process.env.HIKING_MIN_LENGTH
    lat.toString()
    lon.toString()

    const url = queryString.stringifyUrl({
        url: endpoint,
        query: {
            maxResults: '500',
            lat,
            lon,
            maxDistance,
            minLength,
            key
        }
    })

    return fetch(url)
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.error(err))
}

export const getCoordinates = () => {
    return queryDB('SELECT id, name, state, longitude, latitude FROM city')
        .then((rows) => {
            return rows
        })
        .catch((err) => console.error(err))
}

const addToDB = (cityId, numTrails, rating) => {
    queryDB('UPDATE city SET num_trails = ?, trail_rating = ? where id = ?;', [
        numTrails,
        rating,
        cityId
    ]).catch((err) => console.error(err))
}

export const main = () => {
    getCoordinates().then((cityCoordinates) => {
        cityCoordinates.forEach((city) => {
            queryAPI(city.latitude, city.longitude).then((data) => {
                let starTotal = 0
                data.trails.forEach((trail) => (starTotal += trail.stars))

                const numTrails = data.trails.length
                let averageRating = null
                if (numTrails !== 0) {
                    averageRating = (starTotal / data.trails.length).toFixed(2)
                }

                console.log(colors.green(city.name + ', ' + city.state))
                console.log('Number of Trails: '.yellow, numTrails)
                console.log('Average Rating: '.yellow, averageRating)

                addToDB(city.id, numTrails, averageRating)
            })
        })
    })
}
