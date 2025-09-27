import { Number, pipe, Record } from '../../../src'

describe('getIntersectionSemigroup', () => {
  const Semigroup = Record.getIntersectionSemigroup(Number.SemigroupSum)

  it('should return intersection of first and second record combined by provided semigroup', () => {
    pipe({}, Semigroup.combine({ a: 1, b: 2, c: 3 }), expect).toEqual({})
    pipe({ a: 1, b: 2, c: 3 }, Semigroup.combine({}), expect).toEqual({})
    pipe({ a: 1, b: 2, c: 3 }, Semigroup.combine({ b: 1 }), expect).toEqual({
      b: 3,
    })
    pipe({ b: 1 }, Semigroup.combine({ a: 1, b: 2, c: 3 }), expect).toEqual({
      b: 3,
    })
  })
})
