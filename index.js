'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const apiRoutes = require('./controllers/routes')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', apiRoutes)

app.listen(3000)
console.log('Listening on port 3000')
