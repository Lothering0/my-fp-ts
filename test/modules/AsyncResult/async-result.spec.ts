import * as asyncResult from "../../../src/modules/AsyncResult"
import * as async from "../../../src/modules/Async"
import * as result from "../../../src/modules/Result"
import { pipe } from "../../../src/utils/flow"

describe ("fromAsync", () => {
  it ("should return `failure` if promise is rejected", async () => {
    const x = 1
    const fa: async.Async<never> = jest.fn (() => Promise.reject (x))
    const result_ = await pipe (fa, asyncResult.fromAsync, asyncResult.toPromise)
    expect (result_).toEqual<result.Result<typeof x, never>> (result.failure (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `success` if promise is resolved", async () => {
    const x = 1
    const fa: async.Async<typeof x> = jest.fn (() => Promise.resolve (x))
    const result_ = await pipe (fa, asyncResult.fromAsync, asyncResult.toPromise)
    expect (result_).toEqual<result.Result<never, typeof x>> (result.success (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
