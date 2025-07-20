import * as A from "../../../src/modules/Async"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: A.Async<typeof x> = jest.fn (A.of (x))

      const result = await pipe (A.map (fa, identity), A.toPromise)
      expect (result).toEqual (x)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => A.of<never, never, typeof x> (x)

      const fa1: A.Async<typeof x> = jest.fn (getFa ())
      const fa2: A.Async<typeof x> = jest.fn (getFa ())

      const result1 = await pipe (
        A.map (fa1, a => bc (ab (a))),
        A.toPromise,
      )
      const result2 = await pipe (A.map (A.map (fa2, ab), bc), A.toPromise)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })
  })
})
