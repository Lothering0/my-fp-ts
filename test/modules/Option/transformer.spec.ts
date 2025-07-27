import * as option from "../../../src/modules/Option"
import * as readonlyArray from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const AO = option.transform (readonlyArray.Monad)

    expect (AO.of (1)).toEqual<ReadonlyArray<option.Option<number>>> ([
      {
        _tag: "Some",
        value: 1,
      },
    ])

    expect (AO.map (String) (AO.of (1))).toEqual<
      ReadonlyArray<option.Option<string>>
    > ([{ _tag: "Some", value: "1" }])
  })

  it ("should correctly compose multiple monads", () => {
    const AO = option.transform (readonlyArray.Monad)
    const AOO = option.transform (AO.Monad)

    expect (AOO.of (1)).toEqual<
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

    expect (AOO.map (String) (AOO.of (1))).toEqual<
      ReadonlyArray<option.Option<option.Option<string>>>
    > ([
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
