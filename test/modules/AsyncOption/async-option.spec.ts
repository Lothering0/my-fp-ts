import { async, asyncOption, option, pipe } from '../../../src'

describe('fromAsync', () => {
  it('should return `none` if promise is rejected', async () => {
    const a = 1
    const fa: async.Async<never> = jest.fn(() => Promise.reject(a))
    const result = await pipe(fa, asyncOption.fromAsync, asyncOption.toPromise)
    expect(result).toEqual<option.Option<never>>(option.none)
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if promise is resolved', async () => {
    const a = 1
    const fa: async.Async<typeof a> = jest.fn(() => Promise.resolve(a))
    const result = await pipe(fa, asyncOption.fromAsync, asyncOption.toPromise)
    expect(result).toEqual<option.Option<typeof a>>(option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
