import * as syncOption from "../../../src/modules/SyncOption"
import * as option from "../../../src/modules/Option"

describe ("separate", () => {
  it ("should call `SyncOption` instance only once", () => {
    const fa: syncOption.SyncOption<never> = jest.fn (() => option.none)

    const separated = syncOption.separate (fa)
    separated.left ()
    separated.right ()

    expect (fa).toHaveBeenCalledTimes (1)
  })
})
