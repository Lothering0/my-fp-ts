import * as SR from "../../../src/modules/SyncResult"
import * as S from "../../../src/modules/Sync"
import * as R from "../../../src/modules/Result"
import { pipe } from "../../../src/utils/flow"
import { raise } from "../../../src/utils/exceptions"

describe ("toSyncResult", () => {
  it ("should return `failure` if function threw an error", () => {
    const x = 1
    const fa: S.Sync<never> = jest.fn (() => raise (x))
    const result = pipe (SR.toSyncResult (fa), SR.fromSyncResult)
    expect (result).toEqual<R.Result<typeof x, never>> (R.failure (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })

  it ("should return `success` if function returned a value", () => {
    const x = 1
    const fa: S.Sync<typeof x> = jest.fn (() => x)
    const result = pipe (SR.toSyncResult (fa), SR.fromSyncResult)
    expect (result).toEqual<R.Result<never, typeof x>> (R.success (x))
    expect (fa).toHaveBeenCalledTimes (1)
  })
})
