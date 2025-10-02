import { Number, pipe, Array } from '../../../src'

describe('getIntersectionSemigroup', () => {
  const IntersectionSemigroup = Array.getIntersectionSemigroup(
    Number.Equivalence,
  )

  it('should return all elements that contained by both arrays', () => {
    pipe([1, 2, 3], IntersectionSemigroup.combine([2, 3]), expect).toEqual([
      2, 3,
    ])
    pipe([1, 2, 3], IntersectionSemigroup.combine([2, 3, 4]), expect).toEqual([
      2, 3,
    ])
    pipe([1, 2, 3], IntersectionSemigroup.combine([4, 5, 6]), expect).toEqual(
      [],
    )
    pipe([1, 2, 3], IntersectionSemigroup.combine([1, 2, 3]), expect).toEqual([
      1, 2, 3,
    ])
    pipe([], IntersectionSemigroup.combine([1, 2, 3]), expect).toEqual([])
    pipe([1, 2, 3], IntersectionSemigroup.combine([]), expect).toEqual([])
  })
})
