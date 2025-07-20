import * as AO from "../../../src/modules/AsyncOption"
import * as A from "../../../src/modules/Async"
import * as O from "../../../src/modules/Option"
import { pipe } from "../../../src/utils/flow"

describe ("fromAsync", () => {
  it ("should return `none` if promise is rejected", async () => {
    const x = 1
    const fa: A.Async<never> = jest.fn (() => Promise.reject (x))
    const result = await pipe (AO.fromAsync (fa), AO.toPromise)
    expect (result).toEqual<O.Option<never>> (O.none)
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `some` if promise is resolved", async () => {
    const x = 1
    const fa: A.Async<typeof x> = jest.fn (() => Promise.resolve (x))
    const result = await pipe (AO.fromAsync (fa), AO.toPromise)
    expect (result).toEqual<O.Option<typeof x>> (O.some (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
