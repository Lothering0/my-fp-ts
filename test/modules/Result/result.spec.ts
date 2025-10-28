import { Number, pipe, Result, String } from '../../../src'

describe('gen', () => {
  const Equivalence = Result.getEquivalence(
    Number.Equivalence,
    String.Equivalence,
  )

  it('should return succeed value', () => {
    const ma = Result.gen(function* () {
      const a = yield* Result.succeed(1)
      return a
    })
    pipe(ma, Equivalence.equals(Result.succeed(1)), expect).toBe(true)
  })

  it('should return failed value', () => {
    const f = jest.fn()
    const ma = Result.gen(function* () {
      const a = yield* Result.fail('a')
      f()
      return a
    })
    pipe(ma, Equivalence.equals(Result.fail('a')), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should work correctly with several successful generators', () => {
    const ma: Result.Result<number, string> = Result.succeed(1)
    const mb: Result.Result<number, string> = Result.succeed(2)
    const mc = Result.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(Result.succeed(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const f = jest.fn()
    const ma: Result.Result<number, string> = Result.succeed(1)
    const mb: Result.Result<number, string> = Result.fail('a')
    const mc = Result.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      f()
      return a + b
    })
    pipe(mc, Equivalence.equals(Result.fail('a')), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })
})
