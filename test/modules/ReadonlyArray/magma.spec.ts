import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("getDifferenceMagma", () => {
  const Magma = readonlyArray.getDifferenceMagma (number.Eq)

  it ("should return all elements of the first array which is not contained by the second", () => {
    expect (pipe ([1, 2, 3], Magma.combine ([2, 3]))).toEqual ([1])
    expect (pipe ([1, 2, 3], Magma.combine ([2, 3, 4]))).toEqual ([1])
    expect (pipe ([1, 2, 3], Magma.combine ([4, 5, 6]))).toEqual ([1, 2, 3])
    expect (pipe ([1, 2, 3], Magma.combine ([1, 2, 3]))).toEqual ([])
    expect (pipe ([], Magma.combine ([1, 2, 3]))).toEqual ([])
  })
})
