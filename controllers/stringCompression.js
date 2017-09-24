'use strict'

const lzwCompress = require('lzwcompress')

function stringCompression (req, res) {
  const data = req.body.data
  const mode = req.params.mode

  console.log(data)

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

  return res.type('text/plain').status(200).send(bits.toString())
}

function RLE (str) {
  if (str.length <= 0) {
    return 0
  }

  str.toLowerCase()
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

  return compressed.length * 8
}

function LZW (str) {
  if (str.length <= 0) {
    return 0
  }

  let compressed = lzwCompress.pack(str)
  return (compressed.length - 1) * 12
}

function WDE (str) {
  if (str.length <= 0) {
    return 0
  }

  let bits = 0
  let substr = ''
  let dictionary = {}
  for (let i = 0; i < str.length; i++) {
    if (Object.keys(dictionary).length < 4096) {
      if (isLetter(str[i])) {
        substr += str[i]
      } else {
        bits += 12
        if (substr !== '') {
          dictionary[substr] = substr.length
          bits += 12
          substr = ''
        }
      }
    } else {
      bits += 12
    }
  }

  if (substr !== '') {
    dictionary[substr] = substr.length
    bits += 12
  }

  let dictionarySize = 0
  for (let entry in dictionary) {
    dictionarySize += dictionary[entry] * 8
  }

  return bits + dictionarySize
}

function isLetter (str) {
  return str.length === 1 && str.match(/[a-zA-Z]/i)
}

module.exports.stringCompression = stringCompression
module.exports.RLE = RLE
module.exports.LZW = LZW
module.exports.WDE = WDE
