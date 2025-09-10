import * as asyncOption from "../../../src/modules/AsyncOption"
import * as option from "../../../src/modules/Option"

describe ("separate", () => {
  it ("should call `AsyncOption` instance only once", async () => {
    const fa: asyncOption.AsyncOption<never> = jest.fn (
      () =>
        new Promise (resolve => {
          setTimeout (() => {
            resolve (option.none)
          })
        }),
    )

    const [left, right] = asyncOption.separate (fa)
    await left ()
    await right ()

    expect (fa).toHaveBeenCalledTimes (1)
  })
})
