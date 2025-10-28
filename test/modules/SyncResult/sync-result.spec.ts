import {
  pipe,
  raise,
  Result,
  Sync,
  SyncResult,
  UnknownException,
  Number,
  String,
} from '../../../src'

describe('try', () => {
  it('should return `failure` if function threw an error', () => {
    const a = 1
    const fa: Sync.Sync<never> = jest.fn(() => raise(a))
    const result = pipe(fa, SyncResult.try, SyncResult.execute)
    expect(result).toEqual<Result.Result<never, UnknownException>>(
      Result.fail(new UnknownException(a)),
    )
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `success` if function returned a value', () => {
    const a = 1
    const fa: Sync.Sync<typeof a> = jest.fn(() => a)
    const result = pipe(fa, SyncResult.try, SyncResult.execute)
    expect(result).toEqual<Result.Result<typeof a>>(Result.succeed(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})

describe('gen', () => {
  const Equivalence = Result.getEquivalence(
    Number.Equivalence,
    String.Equivalence,
  )

  it('should return succeed value', () => {
    const maybeNumber = SyncResult.succeed(1)
    const ma = SyncResult.gen(function* ($) {
      const a = yield* $(maybeNumber)
      return a
    })
    pipe(
      ma,
      SyncResult.execute,
      Equivalence.equals(Result.succeed(1)),
      expect,
    ).toBe(true)
  })

  it('should return failed value', () => {
    const f = jest.fn()
    const maybeNumber = SyncResult.fail('a')
    const ma = SyncResult.gen(function* ($) {
      const a = yield* $(maybeNumber)
      f()
      return a
    })
    pipe(
      ma,
      SyncResult.execute,
      Equivalence.equals(Result.fail('a')),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should work correctly with several successful generators', () => {
    const ma = SyncResult.succeed(1)
    const mb = SyncResult.succeed(2)
    const mc = SyncResult.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      return a + b
    })
    pipe(
      mc,
      SyncResult.execute,
      Equivalence.equals(Result.succeed(3)),
      expect,
    ).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const f = jest.fn()
    const ma = SyncResult.succeed(1)
    const mb = SyncResult.fail('a')
    const mc = SyncResult.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      f()
      return a + b
    })
    pipe(
      mc,
      SyncResult.execute,
      Equivalence.equals(Result.fail('a')),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })
})
