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

      const result = pipe (SO.map (fa, identity), SO.execute)
      expect (result).toEqual<O.Option<typeof x>> (O.some (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => SO.of<never, never, typeof x> (x)

      const fa1: SO.SyncOption<typeof x> = jest.fn (getFa ())
      const fa2: SO.SyncOption<typeof x> = jest.fn (getFa ())

      const result1 = pipe (
        SO.map (fa1, a => bc (ab (a))),
        SO.execute,
      )
      const result2 = pipe (SO.map (SO.map (fa2, ab), bc), SO.execute)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `none` if the same was provided", () => {
      const n = 1
      const fa: SO.SyncOption<never> = jest.fn (SO.none)
      const result = pipe (SO.map (fa, N.add (n)), SO.execute)
      expect (result).toEqual<O.Option<never>> (O.none)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `some` if it was provided", () => {
      const x = 1
      const n = 1
      const fa: SO.SyncOption<typeof x> = jest.fn (SO.some (x))
      const result = pipe (SO.map (fa, N.add (n)), SO.execute)
      expect (result).toEqual (O.some (N.add (x, n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
