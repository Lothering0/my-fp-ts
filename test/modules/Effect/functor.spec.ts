import { Effect, identity, Number, pipe, Result } from '../../../src'

describe('functor', () => {
  describe('map', () => {
    it('should not run an effect until it will be explicitly called', () => {
      const f = jest.fn()
      pipe(
        Effect.succeed(1),
        Effect.map(() => f()),
      )
      expect(f).toHaveBeenCalledTimes(0)
    })

    it('should satisfy identity law', () => {
      const a = 1
      const f = jest.fn(() => a)
      const fa: Effect.Effect<number> = Effect.fromSync(f)

      const result = pipe(fa, Effect.map(identity), Effect.runSync())
      expect(result).toEqual(Result.succeed(a))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should satisfy composition law', () => {
      const ab = Number.add(5)
      const bc = Number.divide(2)

      const a = 1 as const
      const f1 = jest.fn(() => a)
      const f2 = jest.fn(() => a)

      const fa1: Effect.Effect<typeof a> = Effect.fromSync(f1)
      const fa2: Effect.Effect<typeof a> = Effect.fromSync(f2)

      const result1 = pipe(
        fa1,
        Effect.map(a => bc(ab(a))),
        Effect.runSync(),
      )
      const result2 = pipe(
        fa2,
        Effect.map(ab),
        Effect.map(bc),
        Effect.runSync(),
      )

      expect(result1).toEqual(result2)
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(1)
    })

    it('should return an effect which contains a `failure` if the same was provided', () => {
      const a = 1 as const
      const n = 1
      const f = jest.fn(() => Result.fail(a))
      const fe: Effect.Effect<never, typeof a> = Effect.fromSyncResult(f)
      const result = pipe(fe, Effect.map(Number.add(n)), Effect.runSync())
      expect(result).toEqual(Result.fail(a))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should return an effect which contains a `success` if it was provided', () => {
      const a = 1 as const
      const n = 1
      const f = jest.fn(() => Result.succeed(a))
      const fa: Effect.Effect<typeof a> = Effect.fromSyncResult(f)
      const result = pipe(fa, Effect.map(Number.add(n)), Effect.runSync())
      expect(result).toEqual(pipe(n, Number.add(a), Result.succeed))
      expect(f).toHaveBeenCalledTimes(1)
    })
  })
})
