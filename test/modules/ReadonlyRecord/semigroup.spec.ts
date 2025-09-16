import { number, pipe, readonlyRecord } from "../../../src"

describe ("getIntersectionSemigroup", () => {
  const semigroup = readonlyRecord.getIntersectionSemigroup (number.SemigroupSum)

  it ("should return intersection of first and second record combined by provided semigroup", () => {
    pipe ({}, semigroup.combine ({ a: 1, b: 2, c: 3 }), expect).toEqual ({})
    pipe ({ a: 1, b: 2, c: 3 }, semigroup.combine ({}), expect).toEqual ({})
    pipe ({ a: 1, b: 2, c: 3 }, semigroup.combine ({ b: 1 }), expect).toEqual ({
      b: 3,
    })
    pipe ({ b: 1 }, semigroup.combine ({ a: 1, b: 2, c: 3 }), expect).toEqual ({
      b: 3,
    })
  })
})
