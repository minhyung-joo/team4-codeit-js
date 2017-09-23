'use strict'

function sortNumbers (req, res) {
  let data = req.body.data

  if (data.constructor !== Array) {
    return res.status(400).end()
  }

  let sorted = sortArray(data)

  return res.type('application/json').status(200).json(sorted)
}

function sortArray (input) {
  input.sort((a, b) => a - b)
  return input
}

module.exports = sortNumbers
