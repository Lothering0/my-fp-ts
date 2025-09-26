import { identity, number, pipe, result, syncResult } from "../../../src"

describe ("functor", () => {
  describe ("map", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa: syncResult.SyncResult<never, number> = jest.fn (syncResult.of (a))

      const result_ = pipe (fa, syncResult.map (identity), syncResult.execute)
      expect (result_).toEqual (result.succeed (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy composition law", () => {
      const ab = number.add (5)
      const bc = number.divide (2)

      const a = 1
      const getFa = () => syncResult.of<typeof a> (a)

      const fa1: syncResult.SyncResult<never, typeof a> = jest.fn (getFa ())
      const fa2: syncResult.SyncResult<never, typeof a> = jest.fn (getFa ())

      const result1 = pipe (
        fa1,
        syncResult.map (a => bc (ab (a))),
        syncResult.execute,
      )
      const result2 = pipe (
        fa2,
        syncResult.map (ab),
        syncResult.map (bc),
        syncResult.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa1).toHaveBeenCalledTimes (1)
      expect (fa2).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `failure` if the same was provided", () => {
      const a = 1
      const n = 1
      const fe: syncResult.SyncResult<typeof a, never> = jest.fn (
        syncResult.fail (a),
      )
      const result_ = pipe (
        fe,
        syncResult.map (number.add (n)),
        syncResult.execute,
      )
      expect (result_).toEqual (result.fail (a))
      expect (fe).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `success` if it was provided", () => {
      const a = 1
      const n = 1
      const fa: syncResult.SyncResult<never, typeof a> = jest.fn (
        syncResult.succeed (a),
      )
      const result_ = pipe (
        fa,
        syncResult.map (number.add (n)),
        syncResult.execute,
      )
      expect (result_).toEqual (result.succeed (number.add (a) (n)))
      expect (fa).toHaveBeenCalledTimes (1)
    })
  })
})
