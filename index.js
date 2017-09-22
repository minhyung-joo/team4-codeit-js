'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Testing post endpoint
app.post('/api/test', (req, res) => {
  const data = req.body.data
  return res.status(200).json({ received: data })
})

app.listen(3000)
console.log('Listening on port 3000')
