const assert = require('assert')
const RLE = require('../controllers/stringCompression').RLE
const LZW = require('../controllers/stringCompression').LZW
const WDE = require('../controllers/stringCompression').WDE

describe('stringCompression', () => {
  describe('RLE', () => {
    it('should return correct bits', () => {
      const str = 'RRRRRRTTTTYYYULLL'
      const bits = RLE(str)
      assert.strictEqual(bits, 72)
    })
  })

  describe('LZW', () => {
    it('should return correct bits', () => {
      const str = 'BABAABAAA'
      const bits = LZW(str)
      assert.strictEqual(bits, 72)
    })
  })

  describe('WDE', () => {
    it('should return correct bits', () => {
      const str = 'HOW MUCH WOOD COULD A WOOD CHUCK CHUCK IF A WOOD CHUCK COULD CHUCK WOOD'
      const bits = WDE(str)
      assert.strictEqual(bits, 540)
    })
  })
})
