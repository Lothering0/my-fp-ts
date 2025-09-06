import * as readonlyRecord from "../../../src/modules/ReadonlyRecord"
import { pipe } from "../../../src/utils/flow"

describe ("getDifferenceMagma", () => {
  const Magma = readonlyRecord.getDifferenceMagma ()

  it ("should return record containing all keys with its values which not included in first or second record", () => {
    expect (pipe ({}, Magma.combine ({ b: 2, c: 3 }))).toEqual ({ b: 2, c: 3 })
    expect (pipe ({ a: 1 }, Magma.combine ({}))).toEqual ({ a: 1 })
    expect (pipe ({ a: 1, b: 2, c: 3 }, Magma.combine ({ b: 2, c: 3 }))).toEqual ({
      a: 1,
    })
    expect (
      pipe ({ a: 1, b: 2, c: 3 }, Magma.combine ({ a: 1, b: 2, c: 3 })),
    ).toEqual ({})
    expect (pipe ({ a: 1, b: 2, c: 3 }, Magma.combine ({ a: 1, b: 2 }))).toEqual ({
      c: 3,
    })
  })
})
