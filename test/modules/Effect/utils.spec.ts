import { Effect, Equivalence, pipe, raise, Result, wait } from '../../../src'

const ResultEquivalence = Result.getEquivalence(
  Equivalence.EquivalenceStrict,
  Equivalence.EquivalenceStrict,
)

describe('try', () => {
  it('should return a `failure` if synchronous operation threw an error', async () => {
    const result1 = await pipe(
      Effect.try(() => raise('a')),
      Effect.toPromise,
    )
    pipe(result1, ResultEquivalence.equals(Result.fail('a')), expect).toBe(true)

    const result2 = await pipe(
      Effect.try({
        try: () => raise('a'),
        catch: e => `${e}b`,
      }),
      Effect.toPromise,
    )
    pipe(result2, ResultEquivalence.equals(Result.fail('ab')), expect).toBe(
      true,
    )
  })

  it('should return a `success` if synchronous operation returned a value', async () => {
    const result1 = await pipe(
      Effect.try(() => 1),
      Effect.toPromise,
    )
    pipe(result1, ResultEquivalence.equals(Result.succeed(1)), expect).toBe(
      true,
    )

    const result2 = await pipe(
      Effect.try({
        try: () => 2,
        catch: e => `${e}b`,
      }),
      Effect.toPromise,
    )
    pipe(result2, ResultEquivalence.equals(Result.succeed(2)), expect).toBe(
      true,
    )
  })

  it('should return a `failure` if asynchronous operation rejected an error', async () => {
    const result1 = await pipe(
      Effect.try(() => Promise.reject('a')),
      Effect.toPromise,
    )
    pipe(result1, ResultEquivalence.equals(Result.fail('a')), expect).toBe(true)

    const result2 = await pipe(
      Effect.try({
        try: () => Promise.reject('a'),
        catch: e => `${e}b`,
      }),
      Effect.toPromise,
    )
    pipe(result2, ResultEquivalence.equals(Result.fail('ab')), expect).toBe(
      true,
    )
  })

  it('should return a `success` if asynchronous operation resolved a value', async () => {
    const result1 = await pipe(
      Effect.try(() => Promise.resolve(1)),
      Effect.toPromise,
    )
    pipe(result1, ResultEquivalence.equals(Result.succeed(1)), expect).toBe(
      true,
    )

    const result2 = await pipe(
      Effect.try({
        try: () => Promise.resolve(2),
        catch: e => `${e}b`,
      }),
      Effect.toPromise,
    )
    pipe(result2, ResultEquivalence.equals(Result.succeed(2)), expect).toBe(
      true,
    )
  })
})

describe('all', () => {
  it('should return a success of readonly array of successes', () => {
    pipe(
      Effect.all([
        Effect.succeed(1),
        Effect.succeed('a'),
        Effect.succeed(true),
      ]),
      Effect.run,
      expect,
    ).toEqual(Result.succeed([1, 'a', true]))
  })

  it('should return a first failure', () => {
    const f = jest.fn()
    const g = jest.fn()
    pipe(
      Effect.all([
        Effect.fromSync(() => f()),
        Effect.fail('a'),
        Effect.fail('b'),
        Effect.fromSync(() => g()),
      ]),
      Effect.run,
      expect,
    ).toEqual(Result.fail('a'))
    expect(f).toHaveBeenCalledTimes(1)
    expect(g).toHaveBeenCalledTimes(0)
  })

  it('should return a promise of readonly array of successes', async () => {
    const result = await pipe(
      Effect.all([
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 10 }),
            Effect.map(() => 1),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 30 }),
            Effect.map(() => 'a'),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 20 }),
            Effect.map(() => true),
            Effect.toPromise,
          ),
        ),
      ]),
      Effect.run,
    )
    expect(result).toEqual(Result.succeed([1, 'a', true]))
  })

  it('should return a failure of first rejected promise', async () => {
    const result = await pipe(
      Effect.all([
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 10 }),
            Effect.map(() => 1),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 30 }),
            Effect.mapResult(() => Result.fail('b')),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 20 }),
            Effect.mapResult(() => Result.fail('a')),
            Effect.toPromise,
          ),
        ),
      ]),
      Effect.run,
    )
    expect(result).toEqual(Result.fail('a'))
  })
})

describe('allResults', () => {
  it('should return synchronous result of each effect', () => {
    pipe(
      Effect.allResults([
        Effect.succeed(1),
        Effect.fail('a'),
        Effect.succeed(true),
      ]),
      Effect.map(xs =>
        expect(xs).toEqual([
          Result.succeed(1),
          Result.fail('a'),
          Result.succeed(true),
        ]),
      ),
      Effect.run,
    )
  })

  it('should return asynchronous result of each effect', async () => {
    await pipe(
      Effect.allResults([
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 10 }),
            Effect.map(() => 1),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 20 }),
            Effect.mapResult(() => Result.fail('a')),
            Effect.toPromise,
          ),
        ),
        Effect.fromAsyncResult(() =>
          pipe(
            wait({ ms: 20 }),
            Effect.map(() => true),
            Effect.toPromise,
          ),
        ),
      ]),
      Effect.map(xs =>
        expect(xs).toEqual([
          Result.succeed(1),
          Result.fail('a'),
          Result.succeed(true),
        ]),
      ),
      Effect.run,
    )
  })
})
