import { identity, Number, pipe, State } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa = jest.fn(State.of(a))

      const result = pipe(
        identity,
        State.of,
        State.apply(fa),
        State.evaluate(''),
      )

      expect(result).toEqual(a)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: State.State<string, typeof a> = jest.fn(State.of(a))
      const fab: State.State<string, typeof ab> = jest.fn(State.of(ab))

      const result1 = pipe(fab, State.apply(fa), State.evaluate(''))
      const result2 = pipe(a, ab, State.of, State.evaluate(''))

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: State.State<string, typeof a> = jest.fn(State.of(a))
      const fab: State.State<string, typeof ab> = jest.fn(State.of(ab))

      const result1 = pipe(fab, State.apply(fa), State.evaluate(''))
      const result2 = pipe(
        State.apply(fab)(State.of(ab => ab(a))),
        State.evaluate(''),
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })
  })
})
