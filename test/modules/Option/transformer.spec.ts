import * as option from "../../../src/modules/Option"
import * as readonlyArray from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const readonlyArrayOption = option.transform (readonlyArray.Monad)

    expect (readonlyArrayOption.of (1)).toEqual<
      ReadonlyArray<option.Option<number>>
    > ([
      {
        _tag: "Some",
        value: 1,
      },
    ])

    expect (readonlyArrayOption.map (String) (readonlyArrayOption.of (1))).toEqual<
      ReadonlyArray<option.Option<string>>
    > ([{ _tag: "Some", value: "1" }])
  })

  it ("should correctly compose multiple monads", () => {
    const readonlyArrayOption = option.transform (readonlyArray.Monad)
    const readonlyArrayOptionOption = option.transform (
      readonlyArrayOption.Monad,
    )

    expect (readonlyArrayOptionOption.of (1)).toEqual<
      ReadonlyArray<option.Option<option.Option<number>>>
    > ([
      {
        _tag: "Some",
        value: {
          _tag: "Some",
          value: 1,
        },
      },
    ])

    expect (
      readonlyArrayOptionOption.map (String) (readonlyArrayOptionOption.of (1)),
    ).toEqual<ReadonlyArray<option.Option<option.Option<string>>>> ([
      {
        _tag: "Some",
        value: {
          _tag: "Some",
          value: "1",
        },
      },
    ])
  })
})
