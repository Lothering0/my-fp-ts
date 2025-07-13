import * as O from "../../../src/modules/Option"
import * as A from "../../../src/modules/Array"

describe ("transformer", () => {
  it ("should correctly transform `Array` monad", () => {
    const AO = O.transform (A)

    expect (AO.of (1)).toEqual<O.Option<number>[]> ([
      {
        _tag: "Some",
        value: 1,
      },
    ])

    expect (AO.map (AO.of (1), String)).toEqual<O.Option<string>[]> ([
      { _tag: "Some", value: "1" },
    ])
  })

  it ("should correctly compose multiple monads", () => {
    const AO = O.transform (A)
    const AOO = O.transform (AO)

    expect (AOO.of (1)).toEqual<O.Option<O.Option<number>>[]> ([
      {
        _tag: "Some",
        value: {
          _tag: "Some",
          value: 1,
        },
      },
    ])

    expect (AOO.map (AOO.of (1), String)).toEqual<O.Option<O.Option<string>>[]> ([
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
