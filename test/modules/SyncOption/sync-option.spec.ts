import * as SO from "../../../src/modules/SyncOption"
import * as S from "../../../src/modules/Sync"
import * as O from "../../../src/modules/Option"
import { pipe } from "../../../src/utils/flow"
import { raise } from "../../../src/utils/exceptions"

describe ("fromSync", () => {
  it ("should return `none` if function threw an error", () => {
    const x = 1
    const fa: S.Sync<never> = jest.fn (() => raise (x))
    const result = pipe (SO.fromSync (fa), SO.execute)
    expect (result).toEqual<O.Option<never>> (O.none)
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `some` if function returned a value", () => {
    const x = 1
    const fa: S.Sync<typeof x> = jest.fn (() => x)
    const result = pipe (SO.fromSync (fa), SO.execute)
    expect (result).toEqual<O.Option<typeof x>> (O.some (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
