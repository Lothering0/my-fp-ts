import { Boolean, pipe } from '../../../src'

describe('xor', () => {
  it('should return `true` only if one of operands is `true` and another is `false`', () => {
    pipe(false, Boolean.xor(false), expect).toBe(false)
    pipe(true, Boolean.xor(false), expect).toBe(true)
    pipe(false, Boolean.xor(true), expect).toBe(true)
    pipe(true, Boolean.xor(true), expect).toBe(false)
  })
})
