import { Async, AsyncOption, Option, pipe } from '../../../src'

describe('fromAsync', () => {
  it('should return `none` if promise is rejected', async () => {
    const a = 1
    const fa: Async.Async<never> = jest.fn(() => Promise.reject(a))
    const result = await pipe(fa, AsyncOption.fromAsync, AsyncOption.toPromise)
    expect(result).toEqual<Option.Option<never>>(Option.none())
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if promise is resolved', async () => {
    const a = 1
    const fa: Async.Async<typeof a> = jest.fn(() => Promise.resolve(a))
    const result = await pipe(fa, AsyncOption.fromAsync, AsyncOption.toPromise)
    expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
