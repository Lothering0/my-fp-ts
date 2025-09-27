import { number, pipe, option } from '../../../src'

describe('gen', () => {
  const Equivalence = option.getEquivalence(number.Equivalence)

  it('should return value of some', () => {
    const ma = option.gen(function* () {
      const a = yield* option.some(1)
      return a
    })
    pipe(ma, Equivalence.equals(option.some(1)), expect).toBe(true)
  })

  it('should return none', () => {
    const ma = option.gen(function* () {
      const a = yield* option.none
      return a
    })
    pipe(ma, Equivalence.equals(option.none), expect).toBe(true)
  })

  it('should work correctly with several successful generators', () => {
    const ma: option.Option<number> = option.some(1)
    const mb: option.Option<number> = option.some(2)
    const mc = option.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(option.some(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const ma: option.Option<number> = option.some(1)
    const mb: option.Option<number> = option.none
    const mc = option.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(option.none), expect).toBe(true)
  })
})
