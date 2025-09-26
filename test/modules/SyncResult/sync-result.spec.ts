import { pipe, raise, result, sync, syncResult } from '../../../src'

describe('fromSync', () => {
  it('should return `failure` if function threw an error', () => {
    const a = 1
    const fa: sync.Sync<never> = jest.fn(() => raise(a))
    const result_ = pipe(syncResult.fromSync(fa), syncResult.execute)
    expect(result_).toEqual<result.Result<typeof a, never>>(result.fail(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `success` if function returned a value', () => {
    const a = 1
    const fa: sync.Sync<typeof a> = jest.fn(() => a)
    const result_ = pipe(syncResult.fromSync(fa), syncResult.execute)
    expect(result_).toEqual<result.Result<never, typeof a>>(result.succeed(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
