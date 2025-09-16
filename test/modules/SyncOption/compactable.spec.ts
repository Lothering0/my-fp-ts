import { option, syncOption } from "../../../src"

describe ("separate", () => {
  it ("should call `SyncOption` instance only once", () => {
    const fa: syncOption.SyncOption<never> = jest.fn (() => option.none)

    const [left, right] = syncOption.separate (fa)
    left ()
    right ()

    expect (fa).toHaveBeenCalledTimes (1)
  })
})
