// Main router entry point, sets up all route modules

import express from 'express'
const router = express.Router()

import indexRouter from './indexRouter'

router.use('/', indexRouter)

export default router
