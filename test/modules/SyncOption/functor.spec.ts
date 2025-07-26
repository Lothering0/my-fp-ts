import * as SO from "../../../src/modules/SyncOption"
import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const x = 1
      const fa: SO.SyncOption<typeof x> = jest.fn (SO.of (x))

      const result = pipe (fa, SO.map (identity), SO.execute)
      expect (result).toEqual<O.Option<typeof x>> (O.some (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => SO.of<typeof x> (x)

      const fa1: SO.SyncOption<typeof x> = jest.fn (getFa ())
      const fa2: SO.SyncOption<typeof x> = jest.fn (getFa ())

      const result1 = pipe (
        fa1,
        SO.map (a => bc (ab (a))),
        SO.execute,
      )
      const result2 = pipe (fa2, SO.map (ab), SO.map (bc), SO.execute)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if the same was provided", () => {
      const n = 1
      const fa: SO.SyncOption<never> = jest.fn (SO.none)
      const result = pipe (fa, SO.map (N.add (n)), SO.execute)
      expect (result).toEqual<O.Option<never>> (O.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `some` if it was provided", () => {
      const x = 1
      const n = 1
      const fa: SO.SyncOption<typeof x> = jest.fn (SO.some (x))
      const result = pipe (fa, SO.map (N.add (n)), SO.execute)
      expect (result).toEqual (O.some (N.add (x) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
