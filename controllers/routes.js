const express = require('express')
const router = new express.Router()

// Testing post endpoint
router.post('/test', (req, res) => {
  const data = req.body.data
  return res.status(200).json({ received: data })
})

module.exports = router
