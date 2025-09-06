import * as readonlyRecord from "../../../src/modules/ReadonlyRecord"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("getUnion", () => {
  const union = readonlyRecord.getUnion (number.GroupSum)

  it ("should return union of first and second record combined by provided magma", () => {
    pipe ({ a: 1, b: 2, c: 3 }, union ({ b: 1, c: 2, d: 3 }), expect).toEqual ({
      a: 1,
      b: 3,
      c: 5,
      d: 3,
    })
  })
})
