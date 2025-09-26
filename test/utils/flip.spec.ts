import { flip } from '../../src'

describe('flip', () => {
  it('should correctly flip parameters of a function', () => {
    const f = jest.fn((a: string) => (b: string) => `${a}${b}`)
    const x = 'a'
    const y = 'b'

    expect(flip(f)(y)(x)).toBe(f(x)(y))
    expect(f).toHaveBeenCalledTimes(2)
  })
})
