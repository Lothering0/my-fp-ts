import * as asyncResult from "../../../src/modules/AsyncResult"
import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import { identity } from "../../../src/modules/Identity"
import { pipe } from "../../../src/utils/flow"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const x = 1
      const fa: asyncResult.AsyncResult<never, number> = jest.fn (
        asyncResult.of (x),
      )

      const result_ = await pipe (
        fa,
        asyncResult.map (identity),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.success (x))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const x = 1
      const getFa = () => asyncResult.of<never, typeof x> (x)

      const fa1: asyncResult.AsyncResult<never, typeof x> = jest.fn (getFa ())
      const fa2: asyncResult.AsyncResult<never, typeof x> = jest.fn (getFa ())

      const result1 = await pipe (
        fa1,
        asyncResult.map (a => bc (ab (a))),
        asyncResult.toPromise,
      )
      const result2 = await pipe (
        fa2,
        asyncResult.map (ab),
        asyncResult.map (bc),
        asyncResult.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `failure` if the same was provided", async () => {
      const x = 1
      const n = 1
      const fe: asyncResult.AsyncResult<typeof x, never> = jest.fn (
        asyncResult.failure (x),
      )
      const result_ = await pipe (
        fe,
        asyncResult.map (number.add (n)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.failure (x))
      expect (fe).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `success` if it was provided", async () => {
      const x = 1
      const n = 1
      const fa: asyncResult.AsyncResult<never, typeof x> = jest.fn (
        asyncResult.success (x),
      )
      const result_ = await pipe (
        fa,
        asyncResult.map (number.add (n)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.success (number.add (x) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
