import { boolean, pipe } from '../../../src'

describe('xor', () => {
  it('should return `true` only if one of operands is `true` and another is `false`', () => {
    pipe(false, boolean.xor(false), expect).toBe(false)
    pipe(true, boolean.xor(false), expect).toBe(true)
    pipe(false, boolean.xor(true), expect).toBe(true)
    pipe(true, boolean.xor(true), expect).toBe(false)
  })
})
