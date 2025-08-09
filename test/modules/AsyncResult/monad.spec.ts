import * as asyncResult from "../../../src/modules/AsyncResult"
import * as result from "../../../src/modules/Result"
import { flow, pipe } from "../../../src/utils/flow"

describe ("monad", () => {
  describe ("flatMap", () => {
    it ("should satisfy left identity law", async () => {
      const a = 1
      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn (
        asyncResult.of (a),
      )
      const afb = (x: number) => asyncResult.of (x + 1)

      const result1 = await pipe (
        fa,
        asyncResult.flatMap (afb),
        asyncResult.toPromise,
      )
      const result2 = await pipe (a, afb, asyncResult.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy right identity law", async () => {
      const a = 1
      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn (
        asyncResult.of (a),
      )

      const result1 = await pipe (
        fa,
        asyncResult.flatMap (asyncResult.of),
        asyncResult.toPromise,
      )
      const result2 = await pipe (fa, asyncResult.toPromise)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should satisfy associativity law", async () => {
      const a = 1
      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn (
        asyncResult.of (a),
      )
      const afb = (x: number) => asyncResult.of (x + 1)
      const bfc = (x: number) => asyncResult.of (x / 2)

      const result1 = await pipe (
        fa,
        asyncResult.flatMap (afb),
        asyncResult.flatMap (bfc),
        asyncResult.toPromise,
      )
      const result2 = await pipe (
        fa,
        asyncResult.flatMap (flow (afb, asyncResult.flatMap (bfc))),
        asyncResult.toPromise,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (2)
    })

    it ("should return function containing `failure` if the same was provided", async () => {
      const e = "e"
      const fa: asyncResult.AsyncResult<typeof e, never> = jest.fn (
        asyncResult.fail (e),
      )
      const result_ = await pipe (
        fa,
        asyncResult.flatMap (a => asyncResult.succeed (a + 2)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual<result.Result<typeof e, never>> (result.fail (e))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `failure` if the same was returned by callback function", async () => {
      const e = "e"
      const a = 1
      const fa: asyncResult.AsyncResult<typeof e, typeof a> = jest.fn (
        asyncResult.succeed (a),
      )
      const result_ = await pipe (
        fa,
        asyncResult.flatMap (() => asyncResult.fail (e)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual<result.Result<typeof e, never>> (result.fail (e))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
