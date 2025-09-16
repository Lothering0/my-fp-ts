import { flow, number, pipe, state, string } from "../../../src"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", () => {
      const a = ""
      const fa: state.State<number, string> = jest.fn (state.of (a))
      const afb: {
        (x: string): state.State<number, string>
      } = x => s => [string.concat (number.show (s)) (x), s]

      const result1 = pipe (fa, state.flatMap (afb), state.evaluate (0))
      const result2 = pipe (a, afb, state.evaluate (0))

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", () => {
      const a = ""
      const fa: state.State<number, typeof a> = jest.fn (state.of (a))

      const result1 = pipe (fa, state.flatMap (state.of), state.evaluate (0))
      const result2 = pipe (fa, state.evaluate (0))

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", () => {
      const a = ""
      const fa: state.State<number, typeof a> = jest.fn (state.of (a))
      const afb: {
        (x: string): state.State<number, string>
      } = x => s => [string.concat (number.show (s)) (x), s]
      const bfc: {
        (x: string): state.State<number, string>
      } = x => s => [string.concat (x) (number.show (s)), s]

      const result1 = pipe (
        fa,
        state.flatMap (afb),
        state.flatMap (bfc),
        state.evaluate (0),
      )
      const result2 = pipe (
        fa,
        state.flatMap (flow (afb, state.flatMap (bfc))),
        state.evaluate (0),
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })
  })
})
