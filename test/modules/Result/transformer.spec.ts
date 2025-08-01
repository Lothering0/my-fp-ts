import * as result from "../../../src/modules/Result"
import * as readonlyArray from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const readonlyArrayResult = result.transform (readonlyArray.Monad)

    expect (readonlyArrayResult.succeed (1)).toEqual<
      ReadonlyArray<result.Result<string, number>>
    > ([
      {
        _tag: "Success",
        success: 1,
      },
    ])

    expect (readonlyArrayResult.fail ("a")).toEqual<
      ReadonlyArray<result.Result<string, number>>
    > ([
      {
        _tag: "Failure",
        failure: "a",
      },
    ])

    expect (readonlyArrayResult.map (String) (readonlyArrayResult.of (1))).toEqual<
      ReadonlyArray<result.Result<never, string>>
    > ([{ _tag: "Success", success: "1" }])
  })

  it ("should correctly compose multiple monads", () => {
    const readonlyArrayResult = result.transform (readonlyArray.Monad)
    const readonlyArrayResultResult = result.transform (
      readonlyArrayResult.Monad,
    )

    expect (readonlyArrayResultResult.of (1)).toEqual<
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

    expect (
      readonlyArrayResultResult.map (String) (readonlyArrayResultResult.of (1)),
    ).toEqual<
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
