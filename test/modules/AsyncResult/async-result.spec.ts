import * as AR from "../../../src/modules/AsyncResult"
import * as A from "../../../src/modules/Async"
import * as R from "../../../src/modules/Result"
import { pipe } from "../../../src/utils/flow"

describe ("toAsyncResult", () => {
  it ("should return `failure` if promise is rejected", async () => {
    const x = 1
    const fa: A.Async<never> = jest.fn (() => Promise.reject (x))
    const result = await pipe (AR.toAsyncResult (fa), AR.toPromise)
    expect (result).toEqual<R.Result<typeof x, never>> (R.failure (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `success` if promise is resolved", async () => {
    const x = 1
    const fa: A.Async<typeof x> = jest.fn (() => Promise.resolve (x))
    const result = await pipe (AR.toAsyncResult (fa), AR.toPromise)
    expect (result).toEqual<R.Result<never, typeof x>> (R.success (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
