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
      bits = LZW(data)
      break
    case 'WDE':
      bits = WDE(data)
      break
    default:
      return res.status(400).end()
  }

  return res.type('text/plain').status(200).send(bits)
}

function RLE (str) {
  let compressed = ''
  let lastChar = str[0]
  let counter = 1
  for (let i = 1; i < str.length; i++) {
    if (str[i] === lastChar) {
      counter++
    } else {
      if (counter > 1) {
        compressed += counter
      }
      compressed += lastChar
      lastChar = str[i]
      counter = 1
    }
  }

  if (counter > 1) {
    compressed += counter
  }
  compressed += lastChar
  console.log(compressed)

  return compressed.length * 8
}

function LZW (str) {
  let compressed
  let lastSubstr = str[0]
  let dictionary = {}

  for (let i = 1; i < str.length; i++) {
    let substr = lastSubstr + str[i]
    if (dictionary[substr]) {
      lastSubstr = substr
    } else {

    }
  }

  return compressed.length * 12
}

function WDE (str) {
  let compressed

  return compressed.length
}

module.exports.stringCompression = stringCompression
module.exports.RLE = RLE
module.exports.LZW = LZW
module.exports.WDE = WDE
