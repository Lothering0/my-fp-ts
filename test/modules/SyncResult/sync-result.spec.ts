import {
  pipe,
  raise,
  Result,
  Sync,
  SyncResult,
  UnknownException,
} from '../../../src'

describe('try', () => {
  it('should return `failure` if function threw an error', () => {
    const a = 1
    const fa: Sync.Sync<never> = jest.fn(() => raise(a))
    const result = pipe(fa, SyncResult.try, SyncResult.execute)
    expect(result).toEqual<Result.Result<never, UnknownException>>(
      Result.fail(new UnknownException(a)),
    )
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `success` if function returned a value', () => {
    const a = 1
    const fa: Sync.Sync<typeof a> = jest.fn(() => a)
    const result = pipe(fa, SyncResult.try, SyncResult.execute)
    expect(result).toEqual<Result.Result<typeof a>>(Result.succeed(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
