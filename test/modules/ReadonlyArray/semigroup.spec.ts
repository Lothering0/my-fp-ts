import { Number, pipe, Array } from '../../../src'

describe('getIntersectionSemigroup', () => {
  const Semigroup = Array.getIntersectionSemigroup(Number.Equivalence)

  it('should return all elements that contained by both arrays', () => {
    pipe([1, 2, 3], Semigroup.combine([2, 3]), expect).toEqual([2, 3])
    pipe([1, 2, 3], Semigroup.combine([2, 3, 4]), expect).toEqual([2, 3])
    pipe([1, 2, 3], Semigroup.combine([4, 5, 6]), expect).toEqual([])
    pipe([1, 2, 3], Semigroup.combine([1, 2, 3]), expect).toEqual([1, 2, 3])
    pipe([], Semigroup.combine([1, 2, 3]), expect).toEqual([])
    pipe([1, 2, 3], Semigroup.combine([]), expect).toEqual([])
  })
})
