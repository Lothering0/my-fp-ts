import { Option, pipe, raise, Sync, SyncOption } from '../../../src'

describe('fromSync', () => {
  it('should return `none` if function threw an error', () => {
    const a = 1
    const fa: Sync.Sync<never> = jest.fn(() => raise(a))
    const result = pipe(fa, SyncOption.fromSync, SyncOption.execute)
    expect(result).toEqual<Option.Option<never>>(Option.none())
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if function returned a value', () => {
    const a = 1
    const fa: Sync.Sync<typeof a> = jest.fn(() => a)
    const result = pipe(fa, SyncOption.fromSync, SyncOption.execute)
    expect(result).toEqual<Option.Option<typeof a>>(Option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
