import { Number, pipe, Record } from '../../../src'

describe('getIntersectionSemigroup', () => {
  const IntersectionSemigroup = Record.getIntersectionSemigroup(
    Number.SumSemigroup,
  )

  it('should return intersection of first and second record combined by provided semigroup', () => {
    pipe(
      {},
      IntersectionSemigroup.combine({ a: 1, b: 2, c: 3 }),
      expect,
    ).toEqual({})
    pipe(
      { a: 1, b: 2, c: 3 },
      IntersectionSemigroup.combine({}),
      expect,
    ).toEqual({})
    pipe(
      { a: 1, b: 2, c: 3 },
      IntersectionSemigroup.combine({ b: 1 }),
      expect,
    ).toEqual({
      b: 3,
    })
    pipe(
      { b: 1 },
      IntersectionSemigroup.combine({ a: 1, b: 2, c: 3 }),
      expect,
    ).toEqual({
      b: 3,
    })
  })
})
