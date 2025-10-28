import {
  identity,
  Number,
  pipe,
  Result,
  SyncResult,
  Equivalence,
} from '../../../src'

describe('applicative', () => {
  const ResultEquivalence = Result.getEquivalence(
    Equivalence.EquivalenceStrict,
    Equivalence.EquivalenceStrict,
  )

  describe('apply', () => {
    it('should satisfy identity law', () => {
      const a = 1
      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))

      const result = pipe(
        identity,
        SyncResult.of,
        SyncResult.apply(fa),
        SyncResult.run,
      )

      pipe(result, ResultEquivalence.equals(Result.succeed(a)), expect).toBe(
        true,
      )
      expect(fa).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))
      const fab: SyncResult.SyncResult<typeof ab> = jest.fn(SyncResult.of(ab))

      const result1 = pipe(fab, SyncResult.apply(fa), SyncResult.run)
      const result2 = pipe(a, ab, SyncResult.of, SyncResult.run)

      pipe(result1, ResultEquivalence.equals(result2), expect).toBe(true)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<typeof a> = jest.fn(SyncResult.of(a))
      const fab: SyncResult.SyncResult<typeof ab> = jest.fn(SyncResult.of(ab))

      const result1 = pipe(fab, SyncResult.apply(fa), SyncResult.run)
      const result2 = pipe(
        SyncResult.apply(fab)(SyncResult.of(ab => ab(a))),
        SyncResult.run,
      )

      pipe(result1, ResultEquivalence.equals(result2), expect).toBe(true)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(2)
    })

    it('should return function containing `failure` if `failure` was applied to function', () => {
      const e = 'e'
      const ab = Number.add(5)

      const fa: SyncResult.SyncResult<never, typeof e> = jest.fn(
        SyncResult.fail(e),
      )
      const fab: SyncResult.SyncResult<typeof ab> = jest.fn(SyncResult.of(ab))

      const result = pipe(fab, SyncResult.apply(fa), SyncResult.run)

      pipe(result, ResultEquivalence.equals(Result.fail(e)), expect).toBe(true)
      expect(fa).toHaveBeenCalledTimes(1)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if value was applied to `failure`', () => {
      const e = 'e'
      const a = 1

      const fa: SyncResult.SyncResult<typeof a, typeof e> = jest.fn(
        SyncResult.of(a),
      )
      const fab: SyncResult.SyncResult<never, typeof e> = jest.fn(
        SyncResult.fail(e),
      )

      const result = pipe(fab, SyncResult.apply(fa), SyncResult.run)

      pipe(result, ResultEquivalence.equals(Result.fail(e)), expect).toBe(true)
      expect(fa).toHaveBeenCalledTimes(0)
      expect(fab).toHaveBeenCalledTimes(1)
    })

    it('should return function containing `failure` if `failure` is applying to `failure`', () => {
      const e = 'e'
      const d = 'd'
      const fa: SyncResult.SyncResult<never, typeof e> = jest.fn(
        SyncResult.fail(e),
      )
      const fab: SyncResult.SyncResult<never, typeof d> = jest.fn(
        SyncResult.fail(d),
      )

      const result: Result.Result<unknown, typeof e | typeof d> = pipe(
        fab,
        SyncResult.apply(fa),
        SyncResult.run,
      )

      pipe(result, ResultEquivalence.equals(Result.fail(d)), expect).toBe(true)
      expect(fa).toHaveBeenCalledTimes(0)
      expect(fab).toHaveBeenCalledTimes(1)
    })
  })
})
