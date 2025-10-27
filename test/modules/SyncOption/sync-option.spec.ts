import { Option, pipe, raise, Sync, SyncOption, Number } from '../../../src'

describe('try', () => {
  it('should return `none` if function threw an error', () => {
    const a = 1
    const fa: Sync.Sync<never> = jest.fn(() => raise(a))
    const result = pipe(fa, SyncOption.try, SyncOption.execute)
    expect(result).toEqual<Option.Option<never>>(Option.none())
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if function returned a value', () => {
    const a = 1
    const fa: Sync.Sync<typeof a> = jest.fn(() => a)
    const result = pipe(fa, SyncOption.try, SyncOption.execute)
    expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})

describe('gen', () => {
  const Equivalence = Option.getEquivalence(Number.Equivalence)

  it('should return value of some', () => {
    const maybeNumber = SyncOption.some(1)
    const ma = SyncOption.gen(function* ($) {
      const a = yield* $(maybeNumber)
      return a
    })
    pipe(
      ma,
      SyncOption.execute,
      Equivalence.equals(Option.some(1)),
      expect,
    ).toBe(true)
  })

  it('should return none', () => {
    const f = jest.fn()
    const maybeNumber = SyncOption.none()
    const ma = SyncOption.gen(function* ($) {
      const a = yield* $(maybeNumber)
      f()
      return a
    })
    pipe(
      ma,
      SyncOption.execute,
      Equivalence.equals(Option.none()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should work correctly with several successful generators', () => {
    const ma = SyncOption.some(1)
    const mb = SyncOption.some(2)
    const mc = SyncOption.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      return a + b
    })
    pipe(
      mc,
      SyncOption.execute,
      Equivalence.equals(Option.some(3)),
      expect,
    ).toBe(true)
  })

  it('should work correctly with several generators', () => {
    const f = jest.fn()
    const ma: SyncOption.SyncOption<number> = SyncOption.some(1)
    const mb: SyncOption.SyncOption<number> = SyncOption.none()
    const mc = SyncOption.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      return a + b
    })
    pipe(
      mc,
      SyncOption.execute,
      Equivalence.equals(Option.none()),
      expect,
    ).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })
})
