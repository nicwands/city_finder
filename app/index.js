#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app'
import https from 'https'
import fs from 'fs'
require('dotenv').config()
const debug = require('debug')('node-express:app')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000')
app.set('port', port)

/**
 * Create HTTP app.
 */
const server = https.createServer(
    {
        key: fs.readFileSync(__dirname + '/SSL/server.key'),
        cert: fs.readFileSync(__dirname + '/SSL/server.crt'),
        passphrase: 'process.env.HTTPS_PASSPHRASE'
    },
    app
)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP app "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP app "listening" event.
 */

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
    console.log('Server listening on', bind)
}
