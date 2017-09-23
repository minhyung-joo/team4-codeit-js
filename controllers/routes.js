const express = require('express')
const router = new express.Router()
const stringCompression = require('./stringCompression').stringCompression
const sort = require('./sort')
const heist = require('./jewelleryHeist')
const calcEmptArea = require('./calcEmptArea2')

// Testing post endpoint
router.post('/test', (req, res) => {
  const data = req.body.data
  return res.status(200).json({ received: data })
})

router.post('/stringcompression/:mode', stringCompression)
router.post('/sort', sort)
router.post('/heist', heist)
router.post('/calculateemptyarea2', calcEmptArea)

module.exports = router
