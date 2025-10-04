import { Number, pipe, Option } from '../../../src'

describe('gen', () => {
  const Equivalence = Option.getEquivalence(Number.Equivalence)

  it('should return value of some', () => {
    const ma = Option.gen(function* () {
      const a = yield* Option.some(1)
      return a
    })
    pipe(ma, Equivalence.equals(Option.some(1)), expect).toBe(true)
  })

  it('should return none', () => {
    const ma = Option.gen(function* () {
      const a = yield* Option.none()
      return a
    })
    pipe(ma, Equivalence.equals(Option.none()), expect).toBe(true)
  })

  it('should work correctly with several successful generators', () => {
    const ma: Option.Option<number> = Option.some(1)
    const mb: Option.Option<number> = Option.some(2)
    const mc = Option.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(Option.some(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const ma: Option.Option<number> = Option.some(1)
    const mb: Option.Option<number> = Option.none()
    const mc = Option.gen(function* () {
      const a = yield* ma
      const b = yield* mb
      return a + b
    })
    pipe(mc, Equivalence.equals(Option.none()), expect).toBe(true)
  })
})
