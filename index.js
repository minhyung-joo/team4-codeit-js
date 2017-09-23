'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('./controllers/routes')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', apiRoutes)

app.listen(port)
console.log(`Listening on port ${port}`)
