import { flow, Number, pipe, State, String } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = ''
      const fa: State.State<number, string> = jest.fn(State.of(a))
      const afb: {
        (x: string): State.State<number, string>
      } = x => s => [String.concat(Number.show(s))(x), s]

      const result1 = pipe(fa, State.flatMap(afb), State.evaluate(0))
      const result2 = pipe(a, afb, State.evaluate(0))

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = ''
      const fa: State.State<number, typeof a> = jest.fn(State.of(a))

      const result1 = pipe(fa, State.flatMap(State.of), State.evaluate(0))
      const result2 = pipe(fa, State.evaluate(0))

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = ''
      const fa: State.State<number, typeof a> = jest.fn(State.of(a))
      const afb: {
        (x: string): State.State<number, string>
      } = x => s => [String.concat(Number.show(s))(x), s]
      const bfc: {
        (x: string): State.State<number, string>
      } = x => s => [String.concat(x)(Number.show(s)), s]

      const result1 = pipe(
        fa,
        State.flatMap(afb),
        State.flatMap(bfc),
        State.evaluate(0),
      )
      const result2 = pipe(
        fa,
        State.flatMap(flow(afb, State.flatMap(bfc))),
        State.evaluate(0),
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })
  })
})
