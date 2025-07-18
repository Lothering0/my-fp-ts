import * as SO from "../../../src/modules/SyncOption"
import * as O from "../../../src/modules/Option"

describe ("separate", () => {
  it ("should call `SyncOption` instance only once", async () => {
    const asyncOption: SO.SyncOption<never> = jest.fn (() => O.none)

    const separated = SO.separate (asyncOption)
    separated.left ()
    separated.right ()

    expect (asyncOption).toHaveBeenCalledTimes (1)
  })
})
