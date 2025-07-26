import * as R from "../../../src/modules/Result"
import * as RA from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const AR = R.transform (RA.Monad)

    expect (AR.success (1)).toEqual<ReadonlyArray<R.Result<string, number>>> ([
      {
        _tag: "Success",
        success: 1,
      },
    ])

    expect (AR.failure ("a")).toEqual<ReadonlyArray<R.Result<string, number>>> ([
      {
        _tag: "Failure",
        failure: "a",
      },
    ])

    expect (AR.map (String) (AR.of (1))).toEqual<
      ReadonlyArray<R.Result<never, string>>
    > ([{ _tag: "Success", success: "1" }])
  })

  it ("should correctly compose multiple monads", () => {
    const AR = R.transform (RA.Monad)
    const ARR = R.transform (AR)

    expect (ARR.of (1)).toEqual<
      ReadonlyArray<R.Result<never, R.Result<never, number>>>
    > ([
      {
        _tag: "Success",
        success: {
          _tag: "Success",
          success: 1,
        },
      },
    ])

    expect (ARR.map (String) (ARR.of (1))).toEqual<
      ReadonlyArray<R.Result<never, R.Result<never, string>>>
    > ([
      {
        _tag: "Success",
        success: {
          _tag: "Success",
          success: "1",
        },
      },
    ])
  })
})
