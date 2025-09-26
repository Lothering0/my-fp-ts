import { flow, pipe, result, syncResult } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = 1
      const fa: syncResult.SyncResult<never, typeof a> = jest.fn(
        syncResult.of(a),
      )
      const afb = (x: number) => syncResult.of(x + 1)

      const result1 = pipe(fa, syncResult.flatMap(afb), syncResult.execute)
      const result2 = pipe(a, afb, syncResult.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = 1
      const fa: syncResult.SyncResult<never, typeof a> = jest.fn(
        syncResult.of(a),
      )

      const result1 = pipe(
        fa,
        syncResult.flatMap(syncResult.of),
        syncResult.execute,
      )
      const result2 = pipe(fa, syncResult.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = 1
      const fa: syncResult.SyncResult<never, typeof a> = jest.fn(
        syncResult.of(a),
      )
      const afb = (x: number) => syncResult.of(x + 1)
      const bfc = (x: number) => syncResult.of(x / 2)

      const result1 = pipe(
        fa,
        syncResult.flatMap(afb),
        syncResult.flatMap(bfc),
        syncResult.execute,
      )
      const result2 = pipe(
        fa,
        syncResult.flatMap(flow(afb, syncResult.flatMap(bfc))),
        syncResult.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `failure` if the same was provided', () => {
      const e = 'e'
      const fa: syncResult.SyncResult<typeof e, never> = jest.fn(
        syncResult.fail(e),
      )
      const result_ = pipe(
        fa,
        syncResult.flatMap(a => syncResult.succeed(a + 2)),
        syncResult.execute,
      )
      expect(result_).toEqual<result.Result<typeof e, never>>(result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if the same was returned by callback function', () => {
      const e = 'e'
      const a = 1
      const fa: syncResult.SyncResult<typeof e, typeof a> = jest.fn(
        syncResult.succeed(a),
      )
      const result_ = pipe(
        fa,
        syncResult.flatMap(() => syncResult.fail(e)),
        syncResult.execute,
      )
      expect(result_).toEqual<result.Result<typeof e, never>>(result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
