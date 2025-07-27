import * as syncOption from "../../../src/modules/SyncOption"
import * as sync from "../../../src/modules/Sync"
import * as option from "../../../src/modules/Option"
import { pipe } from "../../../src/utils/flow"
import { raise } from "../../../src/utils/exceptions"

describe ("fromSync", () => {
  it ("should return `none` if function threw an error", () => {
    const x = 1
    const fa: sync.Sync<never> = jest.fn (() => raise (x))
    const result = pipe (fa, syncOption.fromSync, syncOption.execute)
    expect (result).toEqual<option.Option<never>> (option.none)
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `some` if function returned a value", () => {
    const x = 1
    const fa: sync.Sync<typeof x> = jest.fn (() => x)
    const result = pipe (fa, syncOption.fromSync, syncOption.execute)
    expect (result).toEqual<option.Option<typeof x>> (option.some (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
