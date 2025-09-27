import { identity, Number, pipe, State } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should satisfy identity law', () => {
      const a = 0
      const fa: State.State<string, typeof a> = jest.fn(s => [a, s])

      const result = pipe(fa, State.map(identity), State.evaluate(''))

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1
      const getFa = () => State.of<string, typeof a>(a)

      const fa1: State.State<string, typeof a> = jest.fn(getFa())
      const fa2: State.State<string, typeof a> = jest.fn(getFa())

      const result1 = pipe(
        fa1,
        State.map(a => bc(ab(a))),
        State.evaluate(''),
      )
      const result2 = pipe(
        fa2,
        State.map(ab),
        State.map(bc),
        State.evaluate(''),
      )

      expect(result1).toEqual(result2)
      expect(fa1).toHaveBeenCalledTimes(1)
      expect(fa2).toHaveBeenCalledTimes(1)
    })
  })
})
