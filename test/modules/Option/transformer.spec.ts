import * as O from "../../../src/modules/Option"
import * as RA from "../../../src/modules/ReadonlyArray"

describe ("transformer", () => {
  it ("should correctly transform `ReadonlyArray` monad", () => {
    const AO = O.transform (RA.Monad)

    expect (AO.of (1)).toEqual<ReadonlyArray<O.Option<number>>> ([
      {
        _tag: "Some",
        value: 1,
      },
    ])

    expect (AO.map (String) (AO.of (1))).toEqual<ReadonlyArray<O.Option<string>>> ([
      { _tag: "Some", value: "1" },
    ])
  })

  it ("should correctly compose multiple monads", () => {
    const AO = O.transform (RA.Monad)
    const AOO = O.transform (AO.Monad)

    expect (AOO.of (1)).toEqual<ReadonlyArray<O.Option<O.Option<number>>>> ([
      {
        _tag: "Some",
        value: {
          _tag: "Some",
          value: 1,
        },
      },
    ])

    expect (AOO.map (String) (AOO.of (1))).toEqual<
      ReadonlyArray<O.Option<O.Option<string>>>
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
