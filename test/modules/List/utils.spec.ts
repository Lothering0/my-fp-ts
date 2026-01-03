import { List, pipe, Number } from '../../../src'

const ListEquivalence = List.getEquivalence(Number.Equivalence)

describe('fromReadonlyArray', () => {
  it('should generate a `List` from a `ReadonlyArray`', () => {
    const ListEquivalence = List.getEquivalence(Number.Equivalence)
    pipe(
      [1, 2, 3],
      List.fromReadonlyArray,
      ListEquivalence.equals(List.cons(1, List.cons(2, List.cons(3)))),
      expect,
    ).toBe(true)
  })
})

describe('fromIterable', () => {
  it('should generate a `List` from an `Iterable`', () => {
    pipe(
      [1, 2, 3],
      List.fromIterable,
      ListEquivalence.equals(List.cons(1, List.cons(2, List.cons(3)))),
      expect,
    ).toBe(true)
  })
})

describe('copy', () => {
  it('should generate a new instance of `List`', () => {
    const list = List.fromReadonlyArray([1, 2, 3])
    const copy = List.copy(list)

    expect(list !== copy).toBe(true)
    pipe(list, ListEquivalence.equals(copy), expect).toBe(true)
  })
})

describe('length', () => {
  it("should return a `List`'s length", () => {
    pipe([1, 2, 3], List.fromReadonlyArray, List.length, expect).toBe(3)
    pipe(
      [1, 2, 3],
      List.fromReadonlyArray,
      List.append(4),
      List.length,
      expect,
    ).toBe(4)
    pipe(
      [1, 2, 3],
      List.fromReadonlyArray,
      List.prepend(0),
      List.length,
      expect,
    ).toBe(4)
    pipe(
      [1, 2, 3],
      List.fromReadonlyArray,
      List.prepend(0),
      List.append(4),
      List.prepend(-1),
      List.append(5),
      List.length,
      expect,
    ).toBe(7)
  })
})
