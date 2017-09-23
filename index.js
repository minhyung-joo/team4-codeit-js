'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('./controllers/routes')
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', apiRoutes)

app.listen(port)
console.log(`Listening on port ${port}`)
