import { AsyncOption, Option } from '../../../src'

describe('separate', () => {
  it('should call `AsyncOption` instance only once', async () => {
    const fa: AsyncOption.AsyncOption<never> = jest.fn(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(Option.none)
          })
        }),
    )

    const [left, right] = AsyncOption.separate(fa)
    await left()
    await right()

    expect(fa).toHaveBeenCalledTimes(1)
  })
})
