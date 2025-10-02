import { pipe, Record } from '../../../src'

describe('getDifferenceMagma', () => {
  const DifferenceMagma = Record.getDifferenceMagma()

  it('should return record containing all keys with its values which not included in first or second record', () => {
    pipe({}, DifferenceMagma.combine({ b: 2, c: 3 }), expect).toEqual({
      b: 2,
      c: 3,
    })
    pipe({ a: 1 }, DifferenceMagma.combine({}), expect).toEqual({ a: 1 })
    pipe(
      { a: 1, b: 2, c: 3 },
      DifferenceMagma.combine({ b: 2, c: 3 }),
      expect,
    ).toEqual({
      a: 1,
    })
    pipe(
      { a: 1, b: 2, c: 3 },
      DifferenceMagma.combine({ a: 1, b: 2, c: 3 }),
      expect,
    ).toEqual({})
    pipe(
      { a: 1, b: 2, c: 3 },
      DifferenceMagma.combine({ a: 1, b: 2 }),
      expect,
    ).toEqual({
      c: 3,
    })
  })
})
