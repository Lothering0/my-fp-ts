import { Async, AsyncOption, Option, pipe, Number } from '../../../src'

describe('try', () => {
  it('should return `none` if promise is rejected', async () => {
    const a = 1
    const fa: Async.Async<never> = jest.fn(() => Promise.reject(a))
    const result = await pipe(fa, AsyncOption.try, AsyncOption.toPromise)
    expect(result).toEqual<Option.Option<never>>(Option.none())
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if promise is resolved', async () => {
    const a = 1
    const fa: Async.Async<typeof a> = jest.fn(() => Promise.resolve(a))
    const result = await pipe(fa, AsyncOption.try, AsyncOption.toPromise)
    expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})

describe('gen', () => {
  const Equivalence = Option.getEquivalence(Number.Equivalence)

  it('should return value of some', async () => {
    const maybeNumber = AsyncOption.some(1)
    const ma = AsyncOption.gen(function* ($) {
      const a = yield* $(maybeNumber)
      return a
    })
    const a = await ma()
    pipe(a, Equivalence.equals(Option.some(1)), expect).toBe(true)
  })

  it('should return none', async () => {
    const f = jest.fn()
    const maybeNumber = AsyncOption.none()
    const ma = AsyncOption.gen(function* ($) {
      const a = yield* $(maybeNumber)
      f()
      return a
    })
    const a = await ma()
    pipe(a, Equivalence.equals(Option.none()), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })

  it('should work correctly with several successful generators', async () => {
    const ma = AsyncOption.some(1)
    const mb = AsyncOption.some(2)
    const mc = AsyncOption.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      return a + b
    })
    const c = await mc()
    pipe(c, Equivalence.equals(Option.some(3)), expect).toBe(true)
  })

  it('should work correctly with several generators', async () => {
    const f = jest.fn()
    const ma = AsyncOption.some(1)
    const mb = AsyncOption.none()
    const mc = AsyncOption.gen(function* ($) {
      const a = yield* $(ma)
      const b = yield* $(mb)
      f()
      return a + b
    })
    const c = await mc()
    pipe(c, Equivalence.equals(Option.none()), expect).toBe(true)
    expect(f).toHaveBeenCalledTimes(0)
  })
})
