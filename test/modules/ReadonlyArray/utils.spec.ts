import {
  Option,
  Array,
  pipe,
  flow,
  Number,
  Boolean,
  Order,
  String,
  Result,
} from '../../../src'

describe('head', () => {
  it('should return `some` of first element of an array', () => {
    expect(Array.head([])).toEqual(Option.none())
    expect(Array.head([1, 2, 3])).toEqual(Option.some(1))
  })
})

describe('init', () => {
  it('should return `some` of all elements except last', () => {
    expect(Array.init([])).toEqual(Option.none())
    expect(Array.init([1])).toEqual(Option.some([]))
    expect(Array.init([1, 2, 3])).toEqual(Option.some([1, 2]))
  })
})

describe('last', () => {
  it('should return `some` of last element of an array', () => {
    expect(Array.last([])).toEqual(Option.none())
    expect(Array.last([1, 2, 3])).toEqual(Option.some(3))
  })
})

describe('tail', () => {
  it('should return `some` of all elements except first', () => {
    expect(Array.tail([])).toEqual(Option.none())
    expect(Array.tail([1])).toEqual(Option.some([]))
    expect(Array.tail([1, 2, 3])).toEqual(Option.some([2, 3]))
  })
})

describe('lookup', () => {
  it('should return `some` of element by index', () => {
    expect(Array.lookup(-1)([])).toEqual(Option.none())
    expect(Array.lookup(0)([])).toEqual(Option.none())
    expect(Array.lookup(1)([])).toEqual(Option.none())
    expect(Array.lookup(-1)([1, 2, 3])).toEqual(Option.none())
    expect(Array.lookup(0)([1, 2, 3])).toEqual(Option.some(1))
    expect(Array.lookup(2)([1, 2, 3])).toEqual(Option.some(3))
    expect(Array.lookup(3)([1, 2, 3])).toEqual(Option.none())
  })
})

describe('at', () => {
  it('should return `some` of element by positive or negative index', () => {
    expect(Array.at(-1)([])).toEqual(Option.none())
    expect(Array.at(0)([])).toEqual(Option.none())
    expect(Array.at(1)([])).toEqual(Option.none())
    expect(Array.at(-4)([1, 2, 3])).toEqual(Option.none())
    expect(Array.at(-2)([1, 2, 3])).toEqual(Option.some(2))
    expect(Array.at(-1)([1, 2, 3])).toEqual(Option.some(3))
    expect(Array.at(0)([1, 2, 3])).toEqual(Option.some(1))
    expect(Array.at(2)([1, 2, 3])).toEqual(Option.some(3))
    expect(Array.at(3)([1, 2, 3])).toEqual(Option.none())
  })
})

describe('isOutOfBounds', () => {
  it('should return `true` if array has no the index', () => {
    expect(Array.isOutOfBounds(-1)([])).toBe(true)
    expect(Array.isOutOfBounds(0)([])).toBe(true)
    expect(Array.isOutOfBounds(1)([])).toBe(true)
    expect(Array.isOutOfBounds(0)([1, 2, 3])).toBe(false)
    expect(Array.isOutOfBounds(2)([1, 2, 3])).toBe(false)
    expect(Array.isOutOfBounds(3)([1, 2, 3])).toBe(true)
  })
})

describe('findMap', () => {
  it('should return `some` of found mapped element', () => {
    const p = Number.matchOdd({
      onOdd: Option.none,
      onEven: flow(Number.add(10), Option.some),
    })
    const f = Array.findMap(p)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(12))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(12))
  })

  it('should return `some` of found with index mapped element', () => {
    const f = Array.findMap<number, string>((a, i) =>
      pipe(
        i,
        Number.isEven,
        Boolean.and(a > 1),
        Boolean.match({
          onFalse: Option.none,
          onTrue: () => Option.some(`${a}-${i}`),
        }),
      ),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.none())
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some('3-2'))
  })
})

describe('find', () => {
  it('should return `some` of found element', () => {
    const f = Array.find(Number.isEven)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(2))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(2))
  })

  it('should return `some` of found with index element', () => {
    const f = Array.find<number>((a, i) =>
      pipe(i, Number.isEven, Boolean.and(a > 1)),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.none())
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(3))
  })
})

describe('findIndex', () => {
  it('should return `some` of found element', () => {
    const f = Array.findIndex(Number.isEven)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(1))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(1))
  })

  it('should return `some` of found with index element', () => {
    const f = Array.findIndex<number>((a, i) =>
      pipe(i, Number.isEven, Boolean.and(a > 1)),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.none())
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(2))
  })
})

describe('findLastMap', () => {
  it('should return `some` of last found mapped element', () => {
    const p = Number.matchOdd({
      onOdd: Option.none,
      onEven: flow(Number.add(10), Option.some),
    })
    const f = Array.findLastMap(p)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(12))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(14))
  })

  it('should return `some` of found with index mapped element', () => {
    const f = Array.findLastMap<number, string>((a, i) =>
      pipe(
        i,
        Number.isOdd,
        Boolean.and(a > 1),
        Boolean.match({
          onFalse: Option.none,
          onTrue: () => Option.some(`${a}-${i}`),
        }),
      ),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2, 3], f, expect).toEqual(Option.some('2-1'))
    pipe([1, 2, 3, 4, 5], f, expect).toEqual(Option.some('4-3'))
  })
})

describe('findLast', () => {
  it('should return `some` of last found element', () => {
    const f = Array.findLast(Number.isEven)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(2))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(4))
  })

  it('should return `some` of last found with index element', () => {
    const f = Array.findLast<number>((a, i) =>
      pipe(i, Number.isOdd, Boolean.and(a > 1)),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2, 3], f, expect).toEqual(Option.some(2))
    pipe([1, 2, 3, 4, 5], f, expect).toEqual(Option.some(4))
  })
})

describe('findLastIndex', () => {
  it('should return `some` of found element', () => {
    const f = Array.findLastIndex(Number.isEven)

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2], f, expect).toEqual(Option.some(1))
    pipe([1, 2, 3, 4], f, expect).toEqual(Option.some(3))
  })

  it('should return `some` of found with index element', () => {
    const f = Array.findLastIndex<number>((a, i) =>
      pipe(i, Number.isOdd, Boolean.and(a > 1)),
    )

    pipe([], f, expect).toEqual(Option.none())
    pipe([1], f, expect).toEqual(Option.none())
    pipe([1, 2, 3], f, expect).toEqual(Option.some(1))
    pipe([1, 2, 3, 4, 5], f, expect).toEqual(Option.some(3))
  })
})

describe('elem', () => {
  it('should return `true` if element is in array', () => {
    const f = Array.elem(Number.Equivalence)

    pipe([], f(2), expect).toBe(false)
    pipe([1], f(2), expect).toBe(false)
    pipe([1, 2, 3], f(2), expect).toBe(true)
  })
})

describe('every', () => {
  it('should return `true` if every element match predicate', () => {
    const f = Array.every(Number.isEven)

    pipe([], f, expect).toBe(true)
    pipe([1], f, expect).toBe(false)
    pipe([1, 2, 3], f, expect).toBe(false)
    pipe([2, 4, 6], f, expect).toBe(true)
  })

  it('should return `true` if every element match predicate with index', () => {
    const f = Array.every<number>((a, i) =>
      pipe(i, Number.lessThan(3), pipe(a, Number.lessThan(2), Boolean.and)),
    )

    pipe([], f, expect).toBe(true)
    pipe([1], f, expect).toBe(true)
    pipe([1, 1], f, expect).toBe(true)
    pipe([1, 2], f, expect).toBe(false)
    pipe([1, 2, 3], f, expect).toBe(false)
  })
})

describe('exists', () => {
  it('should return `true` if array has element which matches predicate', () => {
    const f = Array.exists(Number.isEven)

    pipe([], f, expect).toBe(false)
    pipe([1], f, expect).toBe(false)
    pipe([1, 2, 3], f, expect).toBe(true)
    pipe([1, 3, 5], f, expect).toBe(false)
  })

  it('should return `true` if array has element which matches predicate with index', () => {
    const f = Array.exists((a, i) =>
      pipe(i, Number.isEven, pipe(a, Number.lessThan(2), Boolean.and)),
    )

    pipe([], f, expect).toBe(false)
    pipe([1], f, expect).toBe(true)
    pipe([2, 2, 2], f, expect).toBe(false)
    pipe([2, 1, 2], f, expect).toBe(false)
    pipe([2, 2, 1], f, expect).toBe(true)
  })
})

describe('failures', () => {
  it('should return array of failures', () => {
    pipe([], Array.failures, expect).toEqual([])
    pipe([Result.succeed(1)], Array.failures, expect).toEqual([])
    pipe([Result.fail(1), Result.succeed(2)], Array.failures, expect).toEqual([
      1,
    ])
    pipe(
      [Result.fail(1), Result.succeed(2), Result.fail(3)],
      Array.failures,
      expect,
    ).toEqual([1, 3])
  })
})

describe('successes', () => {
  it('should return array of successes', () => {
    pipe([], Array.successes, expect).toEqual([])
    pipe([Result.fail(1)], Array.successes, expect).toEqual([])
    pipe([Result.succeed(1), Result.fail(2)], Array.successes, expect).toEqual([
      1,
    ])
    pipe(
      [Result.succeed(1), Result.fail(2), Result.succeed(3)],
      Array.successes,
      expect,
    ).toEqual([1, 3])
  })
})

describe('concat', () => {
  it('should concat two arrays', () => {
    pipe([], Array.concat([1, 2]), expect).toEqual([1, 2])
    pipe([1], Array.concat([2, 3]), expect).toEqual([1, 2, 3])
    pipe([1], Array.concat([]), expect).toEqual([1])
  })
})

describe('prepend', () => {
  it('should add element to the start of array', () => {
    pipe([], Array.prepend(1), expect).toEqual([1])
    pipe([2, 3], Array.prepend(1), expect).toEqual([1, 2, 3])
  })
})

describe('prependAllWith', () => {
  it('should add mapped element before each element', () => {
    const f = Array.prependAllWith(Number.add(10))
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([11, 1, 12, 2])
  })
})

describe('prependAll', () => {
  it('should add element before each element', () => {
    const f = Array.prependAll(0)
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([0, 1, 0, 2])
  })
})

describe('append', () => {
  it('should add element to the end of array', () => {
    pipe([], Array.append(1), expect).toEqual([1])
    pipe([2, 3], Array.append(1), expect).toEqual([2, 3, 1])
  })
})

describe('appendAllWith', () => {
  it('should add mapped element after each element', () => {
    const f = Array.appendAllWith(Number.add(10))
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([1, 11, 2, 12])
  })
})

describe('appendAll', () => {
  it('should add element after each element', () => {
    const f = Array.appendAll(0)
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([1, 0, 2, 0])
  })
})

describe('range', () => {
  it('should generate an array of numbers by given range from min to max value', () => {
    pipe(0, Array.range(0), expect).toEqual([0])
    pipe(1, Array.range(5), expect).toEqual([1, 2, 3, 4, 5])
    pipe(5, Array.range(1), expect).toEqual([5, 4, 3, 2, 1])
  })
})

describe('reverse', () => {
  it('should reverse an array', () => {
    expect(Array.reverse([])).toEqual([])
    expect(Array.reverse([1])).toEqual([1])
    expect(Array.reverse([1, 2, 3])).toEqual([3, 2, 1])
  })
})

describe('sort', () => {
  it('should sort an array by provided `Order` instance', () => {
    pipe([], Array.sort(Number.Order), expect).toEqual([])
    pipe([1], Array.sort(Number.Order), expect).toEqual([1])
    pipe([5, 2, 1, 3, 4], Array.sort(Number.Order), expect).toEqual([
      1, 2, 3, 4, 5,
    ])
  })
})

describe('sortBy', () => {
  it('should sort an array by provided `Order` instances', () => {
    interface User {
      readonly id: number
      readonly name: string
      readonly isActive: boolean
    }

    const users: ReadonlyArray<User> = [
      { id: 1, name: 'Bob', isActive: false },
      { id: 2, name: 'Alex', isActive: true },
      { id: 3, name: 'Dylan', isActive: true },
      { id: 4, name: 'Clare', isActive: false },
    ]

    pipe(users, Array.sortBy([]), expect).toEqual(users)

    pipe(
      users,
      Array.sortBy([
        pipe(
          String.Order,
          Order.contramap(({ name }) => name),
        ),
      ]),
      expect,
    ).toEqual<ReadonlyArray<User>>([
      { id: 2, name: 'Alex', isActive: true },
      { id: 1, name: 'Bob', isActive: false },
      { id: 4, name: 'Clare', isActive: false },
      { id: 3, name: 'Dylan', isActive: true },
    ])

    pipe(
      users,
      Array.sortBy([
        pipe(
          String.Order,
          Order.contramap(({ name }) => name),
        ),
        pipe(
          Boolean.Order,
          Order.reverse,
          Order.contramap(({ isActive }) => isActive),
        ),
      ]),
      expect,
    ).toEqual<ReadonlyArray<User>>([
      { id: 2, name: 'Alex', isActive: true },
      { id: 3, name: 'Dylan', isActive: true },
      { id: 1, name: 'Bob', isActive: false },
      { id: 4, name: 'Clare', isActive: false },
    ])
  })
})

describe('join', () => {
  it('should concat all strings', () => {
    expect(Array.join(',')([])).toEqual('')
    expect(Array.join(',')(['a'])).toEqual('a')
    expect(Array.join(',')(['a', 'b', 'c'])).toEqual('a,b,c')
  })
})

describe('zipWith', () => {
  it('should zip arrays with provided function', () => {
    pipe(
      [],
      Array.zipWith([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual([])
    pipe(
      [1, 2, 3],
      Array.zipWith([], (a, b) => a - b),
      expect,
    ).toEqual([])
    pipe(
      [4, 6, 8],
      Array.zipWith([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual([3, 4, 5])
    pipe(
      [4, 6],
      Array.zipWith([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual([3, 4])
    pipe(
      [4, 6, 8],
      Array.zipWith([1, 2], (a, b) => a - b),
      expect,
    ).toEqual([3, 4])
  })
})

describe('slice', () => {
  it('should correctly slice an array', () => {
    pipe([], Array.slice(0), expect).toEqual([])
    pipe([], Array.slice(1), expect).toEqual([])
    pipe([], Array.slice(0, 2), expect).toEqual([])
    pipe([], Array.slice(1, 2), expect).toEqual([])
    pipe([1, 2, 3], Array.slice(0), expect).toEqual([1, 2, 3])
    pipe([1, 2, 3], Array.slice(1), expect).toEqual([2, 3])
    pipe([1, 2, 3, 4], Array.slice(0, 2), expect).toEqual([1, 2])
    pipe([1, 2, 3, 4], Array.slice(1, 3), expect).toEqual([2, 3])
  })
})

describe('zipWith', () => {
  it('should zip arrays with provided function', () => {
    pipe([], Array.zip([3, 4, 5]), expect).toEqual([])
    pipe([1, 2, 3], Array.zip([]), expect).toEqual([])
    pipe([1, 2, 3], Array.zip([3, 4, 5]), expect).toEqual([
      [1, 3],
      [2, 4],
      [3, 5],
    ])
    pipe([1, 2], Array.zip([3, 4, 5]), expect).toEqual([
      [1, 3],
      [2, 4],
    ])
    pipe([1, 2, 3], Array.zip([3, 4]), expect).toEqual([
      [1, 3],
      [2, 4],
    ])
  })
})

describe('chunksOf', () => {
  it('should correctly slice an array', () => {
    pipe([], Array.chunksOf(0), expect).toEqual([])
    pipe([], Array.chunksOf(1), expect).toEqual([])
    pipe([1, 2, 3], Array.chunksOf(-1), expect).toEqual([])
    pipe([1, 2, 3], Array.chunksOf(0), expect).toEqual([])
    pipe([1, 2, 3], Array.chunksOf(1), expect).toEqual([[1], [2], [3]])
    pipe([1, 2, 3], Array.chunksOf(2), expect).toEqual([[1, 2], [3]])
    pipe([1, 2, 3], Array.chunksOf(3), expect).toEqual([[1, 2, 3]])
    pipe([1, 2, 3], Array.chunksOf(4), expect).toEqual([[1, 2, 3]])
  })
})

describe('takeLeftWhile', () => {
  it('should take elements from the start of an array while predicate holds true', () => {
    const f = Array.takeLeftWhile<number>((a, i) => a + i < 6)
    pipe([], f, expect).toEqual([])
    pipe([1, 2, 3], f, expect).toEqual([1, 2, 3])
    pipe([1, 2, 3, 4, 5], f, expect).toEqual([1, 2, 3])
    pipe([6, 7, 8], f, expect).toEqual([])
  })
})

describe('takeLeft', () => {
  it('should take n elements from the start of an array', () => {
    pipe([], Array.takeLeft(0), expect).toEqual([])
    pipe([], Array.takeLeft(2), expect).toEqual([])
    pipe([], Array.takeLeft(-2), expect).toEqual([])
    pipe([1, 2, 3], Array.takeLeft(0), expect).toEqual([])
    pipe([1, 2, 3], Array.takeLeft(2), expect).toEqual([1, 2])
    pipe([1, 2, 3], Array.takeLeft(-2), expect).toEqual([])
  })
})

describe('takeRightWhile', () => {
  it('should take elements from the end of an array while predicate holds true', () => {
    pipe(
      [],
      Array.takeRightWhile((a, i) => a + i > 0),
      expect,
    ).toEqual([])
    pipe(
      [1, 2, 3],
      Array.takeRightWhile((a, i) => a + i > 0),
      expect,
    ).toEqual([1, 2, 3])
    pipe(
      [1, 2, 3, 4, 5],
      Array.takeRightWhile((a, i) => a + i > 3),
      expect,
    ).toEqual([3, 4, 5])
  })
})

describe('takeRight', () => {
  it('should take n elements from the end of an array', () => {
    pipe([], Array.takeRight(0), expect).toEqual([])
    pipe([], Array.takeRight(2), expect).toEqual([])
    pipe([], Array.takeRight(-2), expect).toEqual([])
    pipe([1, 2, 3], Array.takeRight(0), expect).toEqual([])
    pipe([1, 2, 3], Array.takeRight(2), expect).toEqual([2, 3])
    pipe([1, 2, 3], Array.takeRight(-2), expect).toEqual([])
  })
})

describe('dropLeftWhile', () => {
  it('should drop elements from the start of an array while predicate holds true', () => {
    const f = Array.dropLeftWhile<number>((a, i) => a + i < 6)
    pipe([], f, expect).toEqual([])
    pipe([1, 2, 3], f, expect).toEqual([])
    pipe([1, 2, 3, 4, 5], f, expect).toEqual([4, 5])
    pipe([6, 7, 8], f, expect).toEqual([6, 7, 8])
  })
})

describe('dropLeft', () => {
  it('should drop n elements from the start of an array', () => {
    pipe([], Array.dropLeft(0), expect).toEqual([])
    pipe([], Array.dropLeft(2), expect).toEqual([])
    pipe([], Array.dropLeft(-2), expect).toEqual([])
    pipe([1, 2, 3], Array.dropLeft(0), expect).toEqual([1, 2, 3])
    pipe([1, 2, 3], Array.dropLeft(2), expect).toEqual([3])
    pipe([1, 2, 3], Array.dropLeft(-2), expect).toEqual([1, 2, 3])
  })
})

describe('dropRightWhile', () => {
  it('should drop elements from the end of an array while predicate holds true', () => {
    const f = Array.dropRightWhile<number>((a, i) => a + i > 3)
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([1, 2])
    pipe([1, 2, 3, 4, 5], f, expect).toEqual([1, 2])
    pipe([6, 7, 8], f, expect).toEqual([])
  })
})

describe('dropRight', () => {
  it('should drop n elements from the end of an array', () => {
    pipe([], Array.dropRight(0), expect).toEqual([])
    pipe([], Array.dropRight(2), expect).toEqual([])
    pipe([], Array.dropRight(-2), expect).toEqual([])
    pipe([1, 2, 3], Array.dropRight(0), expect).toEqual([1, 2, 3])
    pipe([1, 2, 3], Array.dropRight(2), expect).toEqual([1])
    pipe([1, 2, 3], Array.dropRight(-2), expect).toEqual([1, 2, 3])
  })
})

describe('dropBothWhile', () => {
  it('should drop elements from the start and the end of an array while predicate holds true', () => {
    const f = Array.dropBothWhile<number>((a, i) => a + i < 4 || a + i > 7)
    pipe([], f, expect).toEqual([])
    pipe([1, 2], f, expect).toEqual([])
    pipe([1, 2, 3, 4, 5], f, expect).toEqual([3, 4])
    pipe(
      [1, 2, 3, 4],
      Array.dropBothWhile(flow(Number.equals(3), Boolean.not)),
      expect,
    ).toEqual([3])
  })
})

describe('comprehension', () => {
  it('should correctly generate an array without predicate', () => {
    expect(Array.comprehension([[1, 2, 3, 4, 5]], Number.add(1))).toEqual([
      2, 3, 4, 5, 6,
    ])
    expect(
      Array.comprehension(
        [
          [1, 2, 3, 4, 5],
          ['a', 'b', 'c'],
        ],
        (num, str) => [num, str],
      ),
    ).toEqual([
      [1, 'a'],
      [1, 'b'],
      [1, 'c'],
      [2, 'a'],
      [2, 'b'],
      [2, 'c'],
      [3, 'a'],
      [3, 'b'],
      [3, 'c'],
      [4, 'a'],
      [4, 'b'],
      [4, 'c'],
      [5, 'a'],
      [5, 'b'],
      [5, 'c'],
    ])
    expect(
      Array.comprehension(
        [[1, 2, 3, 4, 5], [], ['a', 'b', 'c']],
        (num, _, str) => [num, str],
      ),
    ).toEqual([])
    expect(
      Array.comprehension(
        [
          ['a', 'b'],
          ['a', 'b'],
          ['a', 'b'],
        ],
        (a, b, c) => `${a}${b}${c}`,
      ),
    ).toEqual(['aaa', 'aab', 'aba', 'abb', 'baa', 'bab', 'bba', 'bbb'])
  })

  it('should correctly generate an array with predicate', () => {
    expect(
      Array.comprehension([[1, 2, 3, 4, 5]], Number.add(1), Number.isEven),
    ).toEqual([3, 5])
    expect(
      Array.comprehension(
        [
          [1, 2, 3, 4, 5],
          ['a', 'b', 'c'],
        ],
        (num, str) => [num, str],
        num => Number.isEven(num),
      ),
    ).toEqual([
      [2, 'a'],
      [2, 'b'],
      [2, 'c'],
      [4, 'a'],
      [4, 'b'],
      [4, 'c'],
    ])
    expect(
      Array.comprehension(
        [[1, 2, 3, 4, 5], [], ['a', 'b', 'c']],
        (num, _, str) => [num, str],
        num => Number.isEven(num),
      ),
    ).toEqual([])
    expect(
      Array.comprehension(
        [
          ['a', 'b'],
          ['a', 'b'],
          ['a', 'b'],
        ],
        (a, b, c) => `${a}${b}${c}`,
        (_, b) => b !== 'a',
      ),
    ).toEqual(['aba', 'abb', 'bba', 'bbb'])
  })
})
