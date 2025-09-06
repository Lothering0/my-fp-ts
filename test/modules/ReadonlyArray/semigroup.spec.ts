import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"
import { pipe } from "../../../src/utils/flow"

describe ("getIntersectionSemigroup", () => {
  const Semigroup = readonlyArray.getIntersectionSemigroup (number.Eq)

  it ("should return all elements that contained by both arrays", () => {
    expect (pipe ([1, 2, 3], Semigroup.combine ([2, 3]))).toEqual ([2, 3])
    expect (pipe ([1, 2, 3], Semigroup.combine ([2, 3, 4]))).toEqual ([2, 3])
    expect (pipe ([1, 2, 3], Semigroup.combine ([4, 5, 6]))).toEqual ([])
    expect (pipe ([1, 2, 3], Semigroup.combine ([1, 2, 3]))).toEqual ([1, 2, 3])
    expect (pipe ([], Semigroup.combine ([1, 2, 3]))).toEqual ([])
    expect (pipe ([1, 2, 3], Semigroup.combine ([]))).toEqual ([])
  })
})
