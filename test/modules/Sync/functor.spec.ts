import * as S from "../../../src/modules/Sync"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const x = 1
      const fa: S.Sync<typeof x> = jest.fn (S.of (x))

      const result = S.execute (S.map (fa, identity))
      expect (result).toEqual (x)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => S.of<never, never, typeof x> (x)

      const fa1: S.Sync<typeof x> = jest.fn (getFa ())
      const fa2: S.Sync<typeof x> = jest.fn (getFa ())

      const result1 = pipe (
        S.map (fa1, a => bc (ab (a))),
        S.execute,
      )
      const result2 = pipe (S.map (S.map (fa2, ab), bc), S.execute)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
