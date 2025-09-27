import { pipe, String } from '../../../src'

describe('Order', () => {
  it('should correctly compare two strings', () => {
    pipe('', String.compare(''), expect).toBe(0)
    pipe('a', String.compare(''), expect).toBe(1)
    pipe('', String.compare('a'), expect).toBe(-1)
    pipe('a', String.compare('a'), expect).toBe(0)
    pipe('a', String.compare('b'), expect).toBe(-1)
    pipe('b', String.compare('a'), expect).toBe(1)
    pipe('ab', String.compare('a'), expect).toBe(1)
    pipe('a', String.compare('ab'), expect).toBe(-1)
  })
})
