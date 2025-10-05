import { Effect, identity, Number, pipe, Result } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should not run an effect until it was explicitly called', () => {
      const f = jest.fn()
      pipe(
        Effect.succeed(1),
        Effect.map(() => f()),
      )
      expect(f).toHaveBeenCalledTimes(0)
    })

    it('should satisfy identity law', async () => {
      const a = 1
      const f = jest.fn(() => a)
      const fa: Effect.Effect<number> = Effect.fromSync(f)

      const result = await pipe(fa, Effect.map(identity), Effect.run)
      expect(result).toEqual(Result.succeed(a))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', async () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1 as const
      const f1 = jest.fn(() => a)
      const f2 = jest.fn(() => a)

      const fa1: Effect.Effect<typeof a> = Effect.fromSync(f1)
      const fa2: Effect.Effect<typeof a> = Effect.fromSync(f2)

      const result1 = await pipe(
        fa1,
        Effect.map(a => bc(ab(a))),
        Effect.run,
      )
      const result2 = await pipe(
        fa2,
        Effect.map(ab),
        Effect.map(bc),
        Effect.run,
      )

      expect(result1).toEqual(result2)
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `failure` if the same was provided', async () => {
      const a = 1 as const
      const n = 1
      const f = jest.fn(() => Result.fail(a))
      const fe: Effect.Effect<never, typeof a> = Effect.fromSyncResult(f)
      const result = await pipe(fe, Effect.map(Number.add(n)), Effect.run)
      expect(result).toEqual(Result.fail(a))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should return function containing promise of `success` if it was provided', async () => {
      const a = 1 as const
      const n = 1
      const f = jest.fn(() => Result.succeed(a))
      const fa: Effect.Effect<typeof a> = Effect.fromSyncResult(f)
      const result = await pipe(fa, Effect.map(Number.add(n)), Effect.toPromise)
      expect(result).toEqual(pipe(n, Number.add(a), Result.succeed))
      expect(f).toHaveBeenCalledTimes(1)
    })
  })
})
