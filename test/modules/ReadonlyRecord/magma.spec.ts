import * as readonlyRecord from "../../../src/modules/ReadonlyRecord"
import { pipe } from "../../../src/utils/flow"

describe ("getDifferenceMagma", () => {
  const Magma = readonlyRecord.getDifferenceMagma ()

  it ("should return record containing all keys with its values which not included in first or second record", () => {
    pipe ({}, Magma.combine ({ b: 2, c: 3 }), expect).toEqual ({ b: 2, c: 3 })
    pipe ({ a: 1 }, Magma.combine ({}), expect).toEqual ({ a: 1 })
    pipe ({ a: 1, b: 2, c: 3 }, Magma.combine ({ b: 2, c: 3 }), expect).toEqual ({
      a: 1,
    })
    pipe (
      { a: 1, b: 2, c: 3 },
      Magma.combine ({ a: 1, b: 2, c: 3 }),
      expect,
    ).toEqual ({})
    pipe ({ a: 1, b: 2, c: 3 }, Magma.combine ({ a: 1, b: 2 }), expect).toEqual ({
      c: 3,
    })
  })
})
