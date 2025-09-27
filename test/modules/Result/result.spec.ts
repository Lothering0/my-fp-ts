import { number, pipe, result, string } from '../../../src'

describe('gen', () => {
  const Equivalence = result.getEquivalence(
    string.Equivalence,
    number.Equivalence,
  )

  it('should return succeed value', () => {
    const ma = result.gen(function* () {
      const a = yield* result.succeed(1)
      return a
    })
    pipe(ma, Equivalence.equals(result.succeed(1)), expect).toBe(true)
  })

  it('should return failed value', () => {
    const ma = result.gen(function* () {
      const a = yield* result.fail('a')
      return a
    })
    pipe(ma, Equivalence.equals(result.fail('a')), expect).toBe(true)
  })

  it('should work correctly with several successful generators', () => {
    const ma: result.Result<string, number> = result.succeed(1)
    const mb: result.Result<string, number> = result.succeed(2)
    const mc = result.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(result.succeed(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const ma: result.Result<string, number> = result.succeed(1)
    const mb: result.Result<string, number> = result.fail('a')
    const mc = result.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(result.fail('a')), expect).toBe(true)
  })
})
