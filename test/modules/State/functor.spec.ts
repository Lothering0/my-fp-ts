import { identity, number, pipe, state } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const a = 0
      const fa: state.State<string, typeof a> = jest.fn(s => [a, s])

      const result = pipe(fa, state.map(identity), state.evaluate(''))

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = number.add(5)
      const bc = number.divide(2)

      const a = 1
      const getFa = () => state.of<string, typeof a>(a)

      const fa1: state.State<string, typeof a> = jest.fn(getFa())
      const fa2: state.State<string, typeof a> = jest.fn(getFa())

      const result1 = pipe(
        fa1,
        state.map(a => bc(ab(a))),
        state.evaluate(''),
      )
      const result2 = pipe(
        fa2,
        state.map(ab),
        state.map(bc),
        state.evaluate(''),
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })
  })
})
