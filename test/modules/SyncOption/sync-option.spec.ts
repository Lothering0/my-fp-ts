import { option, pipe, raise, sync, syncOption } from '../../../src'

describe('fromSync', () => {
  it('should return `none` if function threw an error', () => {
    const a = 1
    const fa: sync.Sync<never> = jest.fn(() => raise(a))
    const result = pipe(fa, syncOption.fromSync, syncOption.execute)
    expect(result).toEqual<option.Option<never>>(option.none)
    expect(fa).toHaveBeenCalledTimes(1)
  })

  it('should return `some` if function returned a value', () => {
    const a = 1
    const fa: sync.Sync<typeof a> = jest.fn(() => a)
    const result = pipe(fa, syncOption.fromSync, syncOption.execute)
    expect(result).toEqual<option.Option<typeof a>>(option.some(a))
    expect(fa).toHaveBeenCalledTimes(1)
  })
})
