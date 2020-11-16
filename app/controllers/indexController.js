import con from '../db'

export const getIndexData = (req, res) => {
    con.query('SELECT * FROM city', (err, rows, fields) => {
        console.log(err, rows, fields)
        if (err) res.json(err)
        res.json(rows)
    })
}
