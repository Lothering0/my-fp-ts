import * as R from "../../../src/modules/Result"
import * as A from "../../../src/modules/Array"

describe ("transformer", () => {
  it ("should correctly transform `Array` monad", () => {
    const AR = R.transform (A)

    expect (AR.success (1)).toEqual<R.Result<string, number>[]> ([
      {
        _tag: "Success",
        success: 1,
      },
    ])

    expect (AR.failure ("a")).toEqual<R.Result<string, number>[]> ([
      {
        _tag: "Failure",
        failure: "a",
      },
    ])

    expect (AR.map (AR.of (1), String)).toEqual<R.Result<never, string>[]> ([
      { _tag: "Success", success: "1" },
    ])
  })

  it ("should correctly compose multiple monads", () => {
    const AR = R.transform (A)
    const ARR = R.transform (AR)

    expect (ARR.of (1)).toEqual<R.Result<never, R.Result<never, number>>[]> ([
      {
        _tag: "Success",
        success: {
          _tag: "Success",
          success: 1,
        },
      },
    ])

    expect (ARR.map (ARR.of (1), String)).toEqual<
      R.Result<never, R.Result<never, string>>[]
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
