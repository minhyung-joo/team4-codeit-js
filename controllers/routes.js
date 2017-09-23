const express = require('express')
const router = new express.Router()
const stringCompression = require('./stringCompression')

// Testing post endpoint
router.post('/test', (req, res) => {
  const data = req.body.data
  return res.status(200).json({ received: data })
})

router.post('/stringcompression/:mode', stringCompression)

module.exports = router
