import { Effect, Equivalence, pipe, raise, Result } from '../../../src'

describe('try', () => {
  const ResultEquivalence = Result.getEquivalence(
    Equivalence.EquivalenceStrict,
    Equivalence.EquivalenceStrict,
  )

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
