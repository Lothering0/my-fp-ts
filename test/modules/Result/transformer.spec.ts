import * as result from "../../../src/modules/Result"
import * as readonlyArray from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const AR = result.transform (readonlyArray.Monad)

    expect (AR.success (1)).toEqual<ReadonlyArray<result.Result<string, number>>> (
      [
        {
          _tag: "Success",
          success: 1,
        },
      ],
    )

    expect (AR.failure ("a")).toEqual<
      ReadonlyArray<result.Result<string, number>>
    > ([
      {
        _tag: "Failure",
        failure: "a",
      },
    ])

    expect (AR.map (String) (AR.of (1))).toEqual<
      ReadonlyArray<result.Result<never, string>>
    > ([{ _tag: "Success", success: "1" }])
  })

  it ("should correctly compose multiple monads", () => {
    const AR = result.transform (readonlyArray.Monad)
    const ARR = result.transform (AR.Monad)

    expect (ARR.of (1)).toEqual<
      ReadonlyArray<result.Result<never, result.Result<never, number>>>
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
      ReadonlyArray<result.Result<never, result.Result<never, string>>>
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
