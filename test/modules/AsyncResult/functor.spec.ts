import * as AR from "../../../src/modules/AsyncResult"
import * as R from "../../../src/modules/Result"
import * as N from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: AR.AsyncResult<never, number> = jest.fn (AR.of (x))

      const result = await pipe (AR.map (fa, identity), AR.toPromise)
      expect (result).toEqual (R.success (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = N.add (5)
      const bc = N.divide (2)

      const x = 1
      const getFa = () => AR.of<never, typeof x> (x)

      const fa1: AR.AsyncResult<never, typeof x> = jest.fn (getFa ())
      const fa2: AR.AsyncResult<never, typeof x> = jest.fn (getFa ())

      const result1 = await pipe (
        AR.map (fa1, a => bc (ab (a))),
        AR.toPromise,
      )
      const result2 = await pipe (AR.map (AR.map (fa2, ab), bc), AR.toPromise)

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `failure` if the same was provided", async () => {
      const x = 1
      const n = 1
      const fe: AR.AsyncResult<typeof x, never> = jest.fn (AR.failure (x))
      const result = await pipe (AR.map (fe, N.add (n)), AR.toPromise)
      expect (result).toEqual (R.failure (x))
      expect (fe).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `success` if it was provided", async () => {
      const x = 1
      const n = 1
      const fa: AR.AsyncResult<never, typeof x> = jest.fn (AR.success (x))
      const result = await pipe (AR.map (fa, N.add (n)), AR.toPromise)
      expect (result).toEqual (R.success (N.add (x, n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
