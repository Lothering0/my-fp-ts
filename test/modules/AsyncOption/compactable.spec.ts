import * as AO from "../../../src/modules/AsyncOption"
import * as O from "../../../src/modules/Option"

describe ("separate", () => {
  it ("should call `AsyncOption` instance only once", async () => {
    const asyncOption: AO.AsyncOption<never> = jest.fn (
      () =>
        new Promise (resolve => {
          setTimeout (() => {
            resolve (O.none)
          })
        }),
    )

    const separated = AO.separate (asyncOption)
    await separated.left ()
    await separated.right ()

    expect (asyncOption).toHaveBeenCalledTimes (1)
  })
})
