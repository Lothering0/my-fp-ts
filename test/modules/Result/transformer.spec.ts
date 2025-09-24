import { number, readonlyArray, result } from "../../../src"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const readonlyArrayResult = result.transform (readonlyArray.Monad)

    expect (readonlyArrayResult.succeed (1)).toEqual<
      ReadonlyArray<result.Result<string, number>>
    > ([
      {
        _id: "Result",
        _tag: "Success",
        success: 1,
      },
    ])

    expect (readonlyArrayResult.fail ("a")).toEqual<
      ReadonlyArray<result.Result<string, number>>
    > ([
      {
        _id: "Result",
        _tag: "Failure",
        failure: "a",
      },
    ])

    expect (
      readonlyArrayResult.map (number.show) (readonlyArrayResult.of (1)),
    ).toEqual<ReadonlyArray<result.Result<never, string>>> ([
      { _id: "Result", _tag: "Success", success: "1" },
    ])
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
        _id: "Result",
        _tag: "Success",
        success: { _id: "Result", _tag: "Success", success: 1 },
      },
    ])

    expect (
      readonlyArrayResultResult.map (String) (readonlyArrayResultResult.of (1)),
    ).toEqual<
      ReadonlyArray<result.Result<never, result.Result<never, string>>>
    > ([
      {
        _id: "Result",
        _tag: "Success",
        success: {
          _id: "Result",
          _tag: "Success",
          success: "1",
        },
      },
    ])
  })
})
