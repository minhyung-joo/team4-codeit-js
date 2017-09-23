const express = require('express')
const router = new express.Router()
const stringCompression = require('./stringCompression').stringCompression
const sort = require('./sort')
const heist = require('./jewelleryHeist')
const calcEmptArea = require('./calcEmptArea2')
const miniExchange = require('./miniExchange').miniExchange
const startChallenge = require('./miniExchange').startChallenge
const releaseSchedule = require('./releaseSchedule')
const trainPlanner = require('./trainPlanner')
const warehouseKeeper = require('./warehouseKeeper')
const horse = require('./horseRacing')

// Testing post endpoint
router.post('/test', (req, res) => {
  const data = req.body.data
  return res.status(200).json({ received: data })
})

router.post('/stringcompression/:mode', stringCompression)
router.post('/sort', sort)
router.post('/heist', heist)
router.post('/calculateemptyarea', calcEmptArea)
router.post('/mini-exchange', miniExchange)
router.get('/mini-exchange/start', startChallenge)
router.post('/releaseSchedule', releaseSchedule)
router.post('/trainPlanner', trainPlanner)
router.post('/warehouse-keeper/game-start', warehouseKeeper)
router.post('/horse-racing', horse)

module.exports = router
