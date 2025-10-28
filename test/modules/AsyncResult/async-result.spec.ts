import {
  Async,
  AsyncResult,
  pipe,
  Result,
  UnknownException,
  Number,
  String,
} from '../../../src'

describe('try', () => {
  it('should return `failure` if promise is rejected', async () => {
    const a = 1
    const fa: Async.Async<never> = jest.fn(() => Promise.reject(a))
    const result = await pipe(fa, AsyncResult.try, AsyncResult.toPromise)
    expect(result).toEqual<Result.Result<never, UnknownException>>(
      Result.fail(new UnknownException(a)),
    )
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `success` if promise is resolved', async () => {
    const a = 1
    const fa: Async.Async<typeof a> = jest.fn(() => Promise.resolve(a))
    const result = await pipe(fa, AsyncResult.try, AsyncResult.toPromise)
    expect(result).toEqual<Result.Result<typeof a, never>>(Result.succeed(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})

describe('gen', () => {
  const Equivalence = Result.getEquivalence(
    Number.Equivalence,
    String.Equivalence,
  )

  it('should return succeed value', async () => {
    const maybeNumber = AsyncResult.succeed(1)
    const ma = AsyncResult.gen(function* ($) {
      const a = yield* $(maybeNumber)
      return a
    })
    const a = await ma()
    pipe(a, Equivalence.equals(Result.succeed(1)), expect).toBe(true)
  })

  it('should return failed value', async () => {
    const f = jest.fn()
    const maybeNumber = AsyncResult.fail('a')
    const ma = AsyncResult.gen(function* ($) {
      const a = yield* $(maybeNumber)
      f()
      return a
    })
    const a = await ma()
    pipe(a, Equivalence.equals(Result.fail('a')), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should work correctly with several successful generators', async () => {
    const ma = AsyncResult.succeed(1)
    const mb = AsyncResult.succeed(2)
    const mc = AsyncResult.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      return a + b
    })
    const c = await mc()
    pipe(c, Equivalence.equals(Result.succeed(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', async () => {
    const f = jest.fn()
    const ma = AsyncResult.succeed(1)
    const mb = AsyncResult.fail('a')
    const mc = AsyncResult.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      f()
      return a + b
    })
    const c = await mc()
    pipe(c, Equivalence.equals(Result.fail('a')), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })
})
