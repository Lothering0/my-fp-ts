import { Option, SyncOption } from '../../../src'

describe('separate', () => {
  it('should call `SyncOption` instance only once', () => {
    const fa: SyncOption.SyncOption<never> = jest.fn(() => Option.none())

    const [left, right] = SyncOption.separate(fa)
    left()
    right()

    expect(fa).toHaveBeenCalledTimes(1)
  })
})
