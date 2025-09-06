import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("getDifferenceMagma", () => {
  const Magma = readonlyArray.getDifferenceMagma (number.Eq)

  it ("should return all elements of the first array which is not contained by the second", () => {
    pipe ([1, 2, 3], Magma.combine ([2, 3]), expect).toEqual ([1])
    pipe ([1, 2, 3], Magma.combine ([2, 3, 4]), expect).toEqual ([1])
    pipe ([1, 2, 3], Magma.combine ([4, 5, 6]), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], Magma.combine ([1, 2, 3]), expect).toEqual ([])
    pipe ([], Magma.combine ([1, 2, 3]), expect).toEqual ([])
  })
})
