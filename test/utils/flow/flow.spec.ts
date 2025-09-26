import { flow, string, uncurry } from '../../../src'

describe('flow', () => {
  it('should be equal to its only function', () => {
    const f = jest.fn(string.concat('a'))
    expect(flow(f)('b')).toBe(f('b'))
    expect(f).toHaveBeenCalledTimes(2)
  })

  it('should return function that passes result of the previous function execution to the next function', () => {
    const f = jest.fn(string.concat('b'))
    const g = jest.fn(string.concat('c'))
    expect(flow(f, g)('a')).toBe(g(f('a')))
    expect(f).toHaveBeenCalledTimes(2)
    expect(g).toHaveBeenCalledTimes(2)
  })

  it('should apply all passed arguments to the first function', () => {
    const f = jest.fn(uncurry(string.concat))
    const g = jest.fn(string.concat('c'))
    expect(flow(f, g)('a', 'b')).toBe(g(f('a', 'b')))
    expect(f).toHaveBeenCalledTimes(2)
    expect(g).toHaveBeenCalledTimes(2)
  })
})
