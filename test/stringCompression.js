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

    it('should return 0 when passed empty string', () => {
      const str = ''
      const bits = RLE(str)
      assert.strictEqual(bits, 0)
    })

    it('should return correct bits with 2 digits', () => {
      const str = 'RRRRRRRRRRRRR'
      const bits = RLE(str)
      assert.strictEqual(bits, 24)
    })

    it('should return correct bits with 2 letters with 2 digits', () => {
      const str = 'RRRRRRRRRRRRRLLLLLLLLLLLUUIIIIT'
      const bits = RLE(str)
      assert.strictEqual(bits, 88)
    })

    it('should return original string', () => {
      const str = 'ASDFQWERZXCV'
      const bits = RLE(str)
      assert.strictEqual(bits, 96)
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
      let str = 'HOW MUCH WOOD COULD A WOOD CHUCK CHUCK IF A WOOD CHUCK COULD CHUCK WOOD'
      let bits = WDE(str)
      assert.strictEqual(bits, 540)

      str = 'well well now.!!'
      bits = WDE(str)
      assert.strictEqual(bits, 96 + 32 + 24)
    })
  })
})
