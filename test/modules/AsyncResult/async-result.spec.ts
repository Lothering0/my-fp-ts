import * as asyncResult from "../../../src/modules/AsyncResult"
import * as async from "../../../src/modules/Async"
import * as result from "../../../src/modules/Result"
import { pipe } from "../../../src/utils/flow"

describe ("fromAsync", () => {
  it ("should return `failure` if promise is rejected", async () => {
    const a = 1
    const fa: async.Async<never> = jest.fn (() => Promise.reject (a))
    const result_ = await pipe (fa, asyncResult.fromAsync, asyncResult.toPromise)
    expect (result_).toEqual<result.Result<typeof a, never>> (result.fail (a))
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `success` if promise is resolved", async () => {
    const a = 1
    const fa: async.Async<typeof a> = jest.fn (() => Promise.resolve (a))
    const result_ = await pipe (fa, asyncResult.fromAsync, asyncResult.toPromise)
    expect (result_).toEqual<result.Result<never, typeof a>> (result.succeed (a))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
