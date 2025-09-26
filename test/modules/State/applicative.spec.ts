import { identity, number, pipe, state } from "../../../src"

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa = jest.fn (state.of (a))

      const result = pipe (identity, state.of, state.ap (fa), state.evaluate (""))

      expect (result).toEqual (a)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy homomorphism law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: state.State<string, typeof a> = jest.fn (state.of (a))
      const fab: state.State<string, typeof ab> = jest.fn (state.of (ab))

      const result1 = pipe (fab, state.ap (fa), state.evaluate (""))
      const result2 = pipe (a, ab, state.of, state.evaluate (""))

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy interchange law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: state.State<string, typeof a> = jest.fn (state.of (a))
      const fab: state.State<string, typeof ab> = jest.fn (state.of (ab))

      const result1 = pipe (fab, state.ap (fa), state.evaluate (""))
      const result2 = pipe (
        state.ap (fab) (state.of (ab => ab (a))),
        state.evaluate (""),
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (2)
    })
  })
})
