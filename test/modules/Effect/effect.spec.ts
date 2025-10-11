import { Effect, Equivalence, Result, pipe } from '../../../src'

describe('gen', () => {
  const ResultEquivalence = Result.getEquivalence(
    Equivalence.EquivalenceStrict,
    Equivalence.EquivalenceStrict,
  )

  it('should not run an effect until it will be explicitly called', () => {
    const f = jest.fn()
    Effect.gen(function* () {
      f()
    })
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should correctly run successful synchronous operation', async () => {
    const ma = Effect.succeed(1)

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = await pipe(effect, Effect.toPromise)

    pipe(result, ResultEquivalence.equals(Result.succeed(1)), expect).toBe(true)
  })

  it('should correctly run successful synchronous operations', async () => {
    const ma = Effect.succeed(1)
    const mb = Effect.succeed(2)
    const mc = Effect.succeed(3)

    const effect = Effect.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      const c = yield* mc

      return a + b + c
    })
    const result = await pipe(effect, Effect.toPromise)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })

  it('should correctly run failed synchronous operation', async () => {
    const ma = Effect.fail('a')

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = await pipe(effect, Effect.toPromise)

    pipe(result, ResultEquivalence.equals(Result.fail('a')), expect).toBe(true)
  })

  it('should correctly run failed synchronous operations', async () => {
    const ma = jest.fn(() => Effect.succeed(1))
    const mb = jest.fn(() => Effect.fail('a'))
    const mc = jest.fn(() => Effect.succeed(3))

    const effect = Effect.gen(function* () {
      const a = yield* ma()
      const b = yield* mb()
      const c = yield* mc()

      return a + b + c
    })
    const result = await pipe(effect, Effect.toPromise)

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
    const result = await pipe(effect, Effect.toPromise)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })

  it('should correctly run failed asynchronous operation', async () => {
    const ma = Effect.try(() => Promise.reject('a'))

    const effect = Effect.gen(function* () {
      const a = yield* ma
      return a
    })
    const result = await pipe(effect, Effect.toPromise)

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
    const result = await pipe(effect, Effect.toPromise)

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
    const result = await pipe(effect, Effect.toPromise)

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
    const result = await pipe(effect, Effect.toPromise)

    pipe(result, ResultEquivalence.equals(Result.succeed(6)), expect).toBe(true)
  })
})
