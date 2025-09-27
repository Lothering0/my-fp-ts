import { flow, pipe, Result, SyncResult } from '../../../src'

describe('monad', () => {
  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))
      const afb = (x: number) => SyncResult.of(x + 1)

      const result1 = pipe(fa, SyncResult.flatMap(afb), SyncResult.execute)
      const result2 = pipe(a, afb, SyncResult.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))

      const result1 = pipe(
        fa,
        SyncResult.flatMap(SyncResult.of),
        SyncResult.execute,
      )
      const result2 = pipe(fa, SyncResult.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))
      const afb = (x: number) => SyncResult.of(x + 1)
      const bfc = (x: number) => SyncResult.of(x / 2)

      const result1 = pipe(
        fa,
        SyncResult.flatMap(afb),
        SyncResult.flatMap(bfc),
        SyncResult.execute,
      )
      const result2 = pipe(
        fa,
        SyncResult.flatMap(flow(afb, SyncResult.flatMap(bfc))),
        SyncResult.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `failure` if the same was provided', () => {
      const e = 'e'
      const fa: SyncResult.SyncResult<never, typeof e> = jest.fn(
        SyncResult.fail(e),
      )
      const result = pipe(
        fa,
        SyncResult.flatMap(a => SyncResult.succeed(a + 2)),
        SyncResult.execute,
      )
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if the same was returned by callback function', () => {
      const e = 'e'
      const a = 1
      const fa: SyncResult.SyncResult<typeof a, typeof e> = jest.fn(
        SyncResult.succeed(a),
      )
      const result = pipe(
        fa,
        SyncResult.flatMap(() => SyncResult.fail(e)),
        SyncResult.execute,
      )
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
    })
  })
})
