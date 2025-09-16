import { identity, number, pipe, result, syncResult } from "../../../src"

describe ("applicative", () => {
  describe ("ap", () => {
    it ("should satisfy identity law", () => {
      const a = 1
      const fa: syncResult.SyncResult<never, typeof a> = jest.fn (
        syncResult.of (a),
      )

      const result_ = pipe (
        identity.identity,
        syncResult.of,
        syncResult.ap (fa),
        syncResult.execute,
      )

      expect (result_).toEqual<result.Result<never, typeof a>> (result.succeed (a))
      expect (fa).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy homomorphism law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: syncResult.SyncResult<never, typeof a> = jest.fn (
        syncResult.of (a),
      )
      const fab: syncResult.SyncResult<never, typeof ab> = jest.fn (
        syncResult.of (ab),
      )

      const result1 = pipe (fab, syncResult.ap (fa), syncResult.execute)
      const result2 = pipe (a, ab, syncResult.of, syncResult.execute)

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should satisfy interchange law", () => {
      const a = 1
      const ab = number.add (5)

      const fa: syncResult.SyncResult<never, typeof a> = jest.fn (
        syncResult.of (a),
      )
      const fab: syncResult.SyncResult<never, typeof ab> = jest.fn (
        syncResult.of (ab),
      )

      const result1 = pipe (fab, syncResult.ap (fa), syncResult.execute)
      const result2 = pipe (
        syncResult.ap (fab) (syncResult.of (ab => ab (a))),
        syncResult.execute,
      )

      expect (result1).toEqual (result2)
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (2)
    })

    it ("should return function containing `failure` if `failure` was applied to function", () => {
      const e = "e"
      const ab = number.add (5)

      const fa: syncResult.SyncResult<typeof e, never> = jest.fn (
        syncResult.fail (e),
      )
      const fab: syncResult.SyncResult<never, typeof ab> = jest.fn (
        syncResult.of (ab),
      )

      const result_ = pipe (fab, syncResult.ap (fa), syncResult.execute)

      expect (result_).toEqual<result.Result<typeof e, never>> (result.fail (e))
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `failure` if value was applied to `failure`", () => {
      const e = "e"
      const a = 1

      const fa: syncResult.SyncResult<typeof e, typeof a> = jest.fn (
        syncResult.of (a),
      )
      const fab: syncResult.SyncResult<typeof e, never> = jest.fn (
        syncResult.fail (e),
      )

      const result_ = pipe (fab, syncResult.ap (fa), syncResult.execute)

      expect (result_).toEqual<result.Result<typeof e, never>> (result.fail (e))
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })

    it ("should return function containing `failure` if `failure` is applying to `failure`", () => {
      const e = "e"
      const d = "d"
      const fa: syncResult.SyncResult<typeof e, never> = jest.fn (
        syncResult.fail (e),
      )
      const fab: syncResult.SyncResult<typeof d, never> = jest.fn (
        syncResult.fail (d),
      )

      const result_: result.Result<typeof e | typeof d, unknown> = pipe (
        fab,
        syncResult.ap (fa),
        syncResult.execute,
      )

      expect (result_).toEqual<result.Result<typeof e, never>> (result.fail (e))
      expect (fa).toHaveBeenCalledTimes (1)
      expect (fab).toHaveBeenCalledTimes (1)
    })
  })
})
