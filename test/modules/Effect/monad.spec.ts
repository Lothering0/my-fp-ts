import { Effect, flow, pipe, Result } from '../../../src'

describe('monad', () => {
  describe('flat', () => {
    it('should not run an effect until it will be explicitly called', () => {
      const f = jest.fn()
      pipe(() => f(), Effect.fromSync, Effect.succeed, Effect.flat)
      expect(f).toHaveBeenCalledTimes(0)
    })

    it('should return an effect with a `success` if both outer and inner effects are successful', () => {
      pipe(
        1,
        Effect.succeed,
        Effect.succeed,
        Effect.flat,
        Effect.run(),
        expect,
      ).toEqual(Result.succeed(1))
    })

    it('should return an effect with a `failure` of outer effect', () => {
      pipe('e', Effect.fail, Effect.flat, Effect.run(), expect).toEqual(
        Result.fail('e'),
      )
    })

    it('should return an effect with a `failure` of inner effect', () => {
      pipe(
        'd',
        Effect.fail,
        Effect.succeed,
        Effect.flat,
        Effect.run(),
        expect,
      ).toEqual(Result.fail('d'))
    })
  })

  describe('flatMap', () => {
    it('should satisfy left identity law', () => {
      const a = 1 as const
      const f = jest.fn(() => a)
      const fa: Effect.Effect<typeof a> = Effect.fromSync(f)
      const afb = (x: number) => Effect.of(x + 1)

      const result1 = pipe(fa, Effect.flatMap(afb), Effect.runSync())
      const result2 = pipe(a, afb, Effect.runSync())

      expect(result1).toEqual(result2)
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should satisfy right identity law', () => {
      const a = 1 as const
      const f = jest.fn(() => a)
      const fa: Effect.Effect<typeof a> = Effect.fromSync(f)

      const result1 = pipe(fa, Effect.flatMap(Effect.of), Effect.runSync())
      const result2 = pipe(fa, Effect.runSync())

      expect(result1).toEqual(result2)
      expect(f).toHaveBeenCalledTimes(2)
    })

    it('should satisfy associativity law', () => {
      const a = 1 as const
      const f = jest.fn(() => a)
      const fa: Effect.Effect<typeof a> = Effect.fromSync(f)
      const afb = (x: number) => Effect.of(x + 1)
      const bfc = (x: number) => Effect.of(x / 2)

      const result1 = pipe(
        fa,
        Effect.flatMap(afb),
        Effect.flatMap(bfc),
        Effect.runSync(),
      )
      const result2 = pipe(
        fa,
        Effect.flatMap(flow(afb, Effect.flatMap(bfc))),
        Effect.runSync(),
      )

      expect(result1).toEqual(result2)
      expect(f).toHaveBeenCalledTimes(2)
    })

    it('should return an effect which contains a `failure` if the same was provided', () => {
      const e = 'e' as const
      const f = jest.fn(() => Result.fail(e))
      const fa: Effect.Effect<never, typeof e> = Effect.fromSyncResult(f)
      const result = pipe(
        fa,
        Effect.flatMap(a => Effect.succeed(a + 2)),
        Effect.runSync(),
      )
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(f).toHaveBeenCalledTimes(1)
    })

    it('should return an effect which contains a `failure` if the same was returned by callback function', () => {
      const e = 'e' as const
      const a = 1 as const
      const f = jest.fn(() => a)
      const fa: Effect.Effect<typeof a, typeof e> = Effect.fromSync(f)
      const result = pipe(fa, Effect.andThen(Effect.fail(e)), Effect.runSync())
      expect(result).toEqual<Result.Result<never, typeof e>>(Result.fail(e))
      expect(f).toHaveBeenCalledTimes(1)
    })
  })
})
