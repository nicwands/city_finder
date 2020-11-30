import mysql from 'mysql'
import util from 'util'

require('dotenv').config()

//Connect to database
let con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
})

const queryDB = util.promisify(con.query).bind(con)

export default queryDB
