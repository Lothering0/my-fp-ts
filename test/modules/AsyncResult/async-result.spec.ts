import { Async, AsyncResult, pipe, Result } from '../../../src'

describe('fromAsync', () => {
  it('should return `failure` if promise is rejected', async () => {
    const a = 1
    const fa: Async.Async<never> = jest.fn(() => Promise.reject(a))
    const result = await pipe(fa, AsyncResult.fromAsync, AsyncResult.toPromise)
    expect(result).toEqual<Result.Result<typeof a, never>>(Result.fail(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `success` if promise is resolved', async () => {
    const a = 1
    const fa: Async.Async<typeof a> = jest.fn(() => Promise.resolve(a))
    const result = await pipe(fa, AsyncResult.fromAsync, AsyncResult.toPromise)
    expect(result).toEqual<Result.Result<never, typeof a>>(Result.succeed(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
