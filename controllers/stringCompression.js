'use strict'

function stringCompression (req, res) {
  const data = req.body.Data
  const mode = req.params.mode

  let bits
  switch (mode) {
    case 'RLE':
      bits = RLE(data)
      break
    case 'LZW':
      bits = RLE(data)
      break
    case 'WDE':
      bits = RLE(data)
      break
    default:
      return res.status(400).end()
  }

  return res.type('text/plain').status(200).send(bits)
}

function RLE(str) {
  let compressed = ''
}

function LZW(str) {

}

function WDE(str) {

}

module.exports = stringCompression
