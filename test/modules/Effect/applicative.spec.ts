import { Effect, identity, Number, pipe, Result } from '../../../src'

describe('applicative', () => {
  describe('apply', () => {
    it('should not run an effect until it will be explicitly called', () => {
      const f = jest.fn()
      pipe(
        Effect.succeed(() => f()),
        Effect.apply(Effect.succeed(1)),
      )
      expect(f).toHaveBeenCalledTimes(0)
    })

    it('should satisfy identity law', () => {
      const a = 1 as const
      const f = jest.fn(() => a)
      const fa: Effect.Effect<typeof a> = Effect.fromSync(f)

      const result = pipe(identity, Effect.of, Effect.apply(fa), Effect.runSync)

      expect(result).toEqual<Result.Result<typeof a>>(Result.succeed(a))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should satisfy homomorphism law', () => {
      const a = 1 as const
      const ab = Number.add(5)

      const f1 = jest.fn(() => a)
      const f2 = jest.fn(() => ab)

      const fa: Effect.Effect<typeof a> = Effect.fromSync(f1)
      const fab: Effect.Effect<typeof ab> = Effect.fromSync(f2)

      const result1 = pipe(fab, Effect.apply(fa), Effect.runSync)
      const result2 = pipe(a, ab, Effect.of, Effect.runSync)

      expect(result1).toEqual(result2)
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(1)
    })

    it('should satisfy interchange law', () => {
      const a = 1 as const
      const ab = Number.add(5)

      const f1 = jest.fn(() => a)
      const f2 = jest.fn(() => ab)

      const fa: Effect.Effect<typeof a> = Effect.fromSync(f1)
      const fab: Effect.Effect<typeof ab> = Effect.fromSync(f2)

      const result1 = pipe(fab, Effect.apply(fa), Effect.runSync)
      const result2 = pipe(
        Effect.apply(fab)(Effect.of(ab => ab(a))),
        Effect.runSync,
      )

      expect(result1).toEqual(result2)
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(2)
    })

    it('should return an effect which contains a `failure` if a `failure` was applied to function', () => {
      const e = 'e' as const
      const ab = Number.add(5)

      const f1 = jest.fn(() => ab)
      const f2 = jest.fn(() => Result.fail(e))

      const fab: Effect.Effect<typeof ab> = Effect.fromSync(f1)
      const fa: Effect.Effect<never, typeof e> = Effect.fromSyncResult(f2)

      const result = pipe(fab, Effect.apply(fa), Effect.runSync)

      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(1)
    })

    it('should return an effect which contains a `failure` if value was applied to a `failure`', () => {
      const e = 'e' as const
      const a = 1 as const

      const f1 = jest.fn(() => Result.fail(e))
      const f2 = jest.fn(() => a)

      const fab: Effect.Effect<never, typeof e> = Effect.fromSyncResult(f1)
      const fa: Effect.Effect<typeof a, typeof e> = Effect.fromSync(f2)

      const result = pipe(fab, Effect.apply(fa), Effect.runSync)

      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(0)
    })

    it('should return an effect which contains a `failure` if a `failure` is applying to a `failure`', () => {
      const e = 'e' as const
      const d = 'd' as const

      const f1 = jest.fn(() => Result.fail(e))
      const f2 = jest.fn(() => Result.fail(d))

      const fab: Effect.Effect<never, typeof e> = Effect.fromSyncResult(f1)
      const fa: Effect.Effect<never, typeof d> = Effect.fromSyncResult(f2)

      const result: Result.Result<unknown, typeof e | typeof d> = pipe(
        fab,
        Effect.apply(fa),
        Effect.runSync,
      )

      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(f1).toHaveBeenCalledTimes(1)
      expect(f2).toHaveBeenCalledTimes(0)
    })
  })
})
