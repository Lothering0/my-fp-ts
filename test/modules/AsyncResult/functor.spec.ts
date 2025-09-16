import { asyncResult, identity, number, pipe, result } from "../../../src"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", async () => {
      const a = 1
      const fa: asyncResult.AsyncResult<never, number> = jest.fn (
        asyncResult.of (a),
      )

      const result_ = await pipe (
        fa,
        asyncResult.map (identity.identity),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.succeed (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", async () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const a = 1
      const getFa = () => asyncResult.of<typeof a> (a)

      const fa1: asyncResult.AsyncResult<never, typeof a> = jest.fn (getFa ())
      const fa2: asyncResult.AsyncResult<never, typeof a> = jest.fn (getFa ())

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
      const a = 1
      const n = 1
      const fe: asyncResult.AsyncResult<typeof a, never> = jest.fn (
        asyncResult.fail (a),
      )
      const result_ = await pipe (
        fe,
        asyncResult.map (number.add (n)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.fail (a))
      expect (fe).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing promise of `success` if it was provided", async () => {
      const a = 1
      const n = 1
      const fa: asyncResult.AsyncResult<never, typeof a> = jest.fn (
        asyncResult.succeed (a),
      )
      const result_ = await pipe (
        fa,
        asyncResult.map (number.add (n)),
        asyncResult.toPromise,
      )
      expect (result_).toEqual (result.succeed (number.add (a) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
