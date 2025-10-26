import { Effect, Equivalence, Result, pipe } from '../../../src'

const ResultEquivalence = Result.getEquivalence(
  Equivalence.EquivalenceStrict,
  Equivalence.EquivalenceStrict,
)

describe('run', () => {
  it('should not overflow call stack with synchronous operations', () => {
    let effect = Effect.succeed(0)

    for (let i = 0; i < 120_000; i++) {
      effect = pipe(
        effect,
        Effect.map(n => n + 1),
      )
    }

    pipe(
      effect,
      Effect.runSync,
      ResultEquivalence.equals(Result.succeed(120_000)),
      expect,
    ).toBe(true)
  })

  it('should not overflow call stack with asynchronous operations', async () => {
    let effect = Effect.fromAsync(() => Promise.resolve(0))

    for (let i = 0; i < 120_000; i++) {
      effect = pipe(
        effect,
        Effect.map(n => n + 1),
      )
    }

    const result = await pipe(effect, Effect.runAsync)

    pipe(
      result,
      ResultEquivalence.equals(Result.succeed(120_000)),
      expect,
    ).toBe(true)
  })
})

describe('runSync', () => {
  it('should throw the exception if effect ran asynchronously', () => {
    expect(() =>
      pipe(
        Effect.fromAsync(() => Promise.resolve(0)),
        Effect.runSync,
      ),
    ).toThrow(Effect.AsyncEffectException)

    expect(() =>
      pipe(
        Effect.of(Effect.fromAsync(() => Promise.resolve(0))),
        Effect.flat,
        Effect.runSync,
      ),
    ).toThrow(Effect.AsyncEffectException)

    expect(() =>
      pipe(
        Effect.fromAsync(() => Promise.resolve(Effect.of(0))),
        Effect.flat,
        Effect.runSync,
      ),
    ).toThrow(Effect.AsyncEffectException)
  })
})

describe('runAsync', () => {
  it('should throw the exception if effect ran synchronously', () => {
    expect(() => pipe(0, Effect.of, Effect.runAsync)).toThrow(
      Effect.SyncEffectException,
    )

    expect(() =>
      pipe(0, Effect.of, Effect.of, Effect.flat, Effect.runAsync),
    ).toThrow(Effect.SyncEffectException)
  })
})

describe('gen', () => {
  it('should not run an effect until it will be explicitly called', () => {
    const f = jest.fn()
    Effect.gen(function* () {
      f()
    })
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should correctly run successful synchronous operation', () => {
    const ma = Effect.succeed(1)

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = pipe(effect, Effect.runSync)

    pipe(result, ResultEquivalence.equals(Result.succeed(1)), expect).toBe(true)
  })

  it('should correctly run successful synchronous operations', () => {
    const ma = Effect.succeed(1)
    const mb = Effect.succeed(2)
    const mc = Effect.succeed(3)

    const effect = Effect.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      const c = yield* mc

      return a + b + c
    })
    const result = pipe(effect, Effect.runSync)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })

  it('should correctly run failed synchronous operation', () => {
    const ma = Effect.fail('a')

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = pipe(effect, Effect.runSync)

    pipe(result, ResultEquivalence.equals(Result.fail('a')), expect).toBe(true)
  })

  it('should correctly run failed synchronous operations', () => {
    const ma = jest.fn(() => Effect.succeed(1))
    const mb = jest.fn(() => Effect.fail('a'))
    const mc = jest.fn(() => Effect.succeed(3))

    const effect = Effect.gen(function* () {
      const a = yield* ma()
      const b = yield* mb()
      const c = yield* mc()

      return a + b + c
    })
    const result = pipe(effect, Effect.runSync)

    pipe(result, ResultEquivalence.equals(Result.fail('a')), expect).toBe(true)
    expect(ma).toHaveBeenCalledTimes(1)
    expect(mb).toHaveBeenCalledTimes(1)
    expect(mc).toHaveBeenCalledTimes(0)
  })

  it('should correctly run successful asynchronous operations', async () => {
    const ma = Effect.fromAsync(() => Promise.resolve(1))
    const mb = Effect.fromAsync(() => Promise.resolve(2))
    const mc = Effect.fromAsync(() => Promise.resolve(3))

    const effect = Effect.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      const c = yield* mc

      return a + b + c
    })
    const result = await pipe(effect, Effect.runAsync)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })

  it('should correctly run failed asynchronous operation', async () => {
    const ma = Effect.try(() => Promise.reject('a'))

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = await pipe(effect, Effect.runAsync)

    const f = jest.fn()
    pipe(
      result,
      Result.mapLeft(e => {
        f()
        expect(e.exception).toBe('a')
      }),
    )
    expect(f).toHaveBeenCalledTimes(1)
  })

  it('should correctly run failed asynchronous operations', async () => {
    const ma = jest.fn(() => Effect.fromAsync(() => Promise.resolve(1)))
    const mb = jest.fn(() => Effect.try(() => Promise.reject('a')))
    const mc = jest.fn(() => Effect.fromAsync(() => Promise.resolve(3)))

    const effect = Effect.gen(function* () {
      const a = yield* ma()
      const b = yield* mb()
      const c = yield* mc()

      return a + b + c
    })
    const result = await pipe(effect, Effect.runAsync)

    const f = jest.fn()
    pipe(
      result,
      Result.mapLeft(e => {
        f()
        expect(e.exception).toBe('a')
      }),
    )
    expect(f).toHaveBeenCalledTimes(1)
    expect(ma).toHaveBeenCalledTimes(1)
    expect(mb).toHaveBeenCalledTimes(1)
    expect(mc).toHaveBeenCalledTimes(0)
  })

  it('should correctly run async, then sync, then again async operations', async () => {
    const ma = Effect.fromAsync(() => Promise.resolve(1))
    const mb = Effect.succeed(2)
    const mc = Effect.fromAsync(() => Promise.resolve(3))

    const effect = Effect.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      const c = yield* mc

      return a + b + c
    })
    const result = await pipe(effect, Effect.runAsync)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })

  it('should correctly run sync, then async, then again sync operations', async () => {
    const ma = Effect.succeed(1)
    const mb = Effect.fromAsync(() => Promise.resolve(2))
    const mc = Effect.succeed(3)

    const effect = Effect.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      const c = yield* mc

      return a + b + c
    })
    const result = await pipe(effect, Effect.runAsync)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })
})
