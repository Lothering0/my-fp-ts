import { identity, Number, pipe, Result, SyncResult } from '../../../src'

describe('applicative', () => {
  describe('ap', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<never, typeof a> = jest.fn(
        SyncResult.of(a),
      )

      const result = pipe(
        identity,
        SyncResult.of,
        SyncResult.ap(fa),
        SyncResult.execute,
      )

      expect(result).toEqual<Result.Result<never, typeof a>>(Result.succeed(a))
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<never, typeof a> = jest.fn(
        SyncResult.of(a),
      )
      const fab: SyncResult.SyncResult<never, typeof ab> = jest.fn(
        SyncResult.of(ab),
      )

      const result1 = pipe(fab, SyncResult.ap(fa), SyncResult.execute)
      const result2 = pipe(a, ab, SyncResult.of, SyncResult.execute)

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<never, typeof a> = jest.fn(
        SyncResult.of(a),
      )
      const fab: SyncResult.SyncResult<never, typeof ab> = jest.fn(
        SyncResult.of(ab),
      )

      const result1 = pipe(fab, SyncResult.ap(fa), SyncResult.execute)
      const result2 = pipe(
        SyncResult.ap(fab)(SyncResult.of(ab => ab(a))),
        SyncResult.execute,
      )

      expect(result1).toEqual(result2)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `failure` if `failure` was applied to function', () => {
      const e = 'e'
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<typeof e, never> = jest.fn(
        SyncResult.fail(e),
      )
      const fab: SyncResult.SyncResult<never, typeof ab> = jest.fn(
        SyncResult.of(ab),
      )

      const result = pipe(fab, SyncResult.ap(fa), SyncResult.execute)

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if value was applied to `failure`', () => {
      const e = 'e'
      const a = 1

      const fa: SyncResult.SyncResult<typeof e, typeof a> = jest.fn(
        SyncResult.of(a),
      )
      const fab: SyncResult.SyncResult<typeof e, never> = jest.fn(
        SyncResult.fail(e),
      )

      const result = pipe(fab, SyncResult.ap(fa), SyncResult.execute)

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if `failure` is applying to `failure`', () => {
      const e = 'e'
      const d = 'd'
      const fa: SyncResult.SyncResult<typeof e, never> = jest.fn(
        SyncResult.fail(e),
      )
      const fab: SyncResult.SyncResult<typeof d, never> = jest.fn(
        SyncResult.fail(d),
      )

      const result: Result.Result<typeof e | typeof d, unknown> = pipe(
        fab,
        SyncResult.ap(fa),
        SyncResult.execute,
      )

      expect(result).toEqual<Result.Result<typeof e, never>>(Result.fail(e))
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
