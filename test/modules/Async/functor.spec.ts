import * as A from "../../../src/modules/Async"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: A.Async<typeof x> = jest.fn (A.of (x))

      const result = await pipe (fa, A.map (identity), A.toPromise)
      expect (result).toEqual (x)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => A.of<typeof x> (x)

      const fa1: A.Async<typeof x> = jest.fn (getFa ())
      const fa2: A.Async<typeof x> = jest.fn (getFa ())

      const result1 = await pipe (
        fa1,
        A.map (a => bc (ab (a))),
        A.toPromise,
      )
      const result2 = await pipe (fa2, A.map (ab), A.map (bc), A.toPromise)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
