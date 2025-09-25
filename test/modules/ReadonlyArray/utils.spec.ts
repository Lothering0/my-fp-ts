import {
  option,
  array,
  pipe,
  flow,
  number,
  boolean,
  order,
  string,
  result,
} from "../../../src"

describe ("head", () => {
  it ("should return `some` of first element of an array", () => {
    expect (array.head ([])).toEqual (option.none)
    expect (array.head ([1, 2, 3])).toEqual (option.some (1))
  })
})

describe ("init", () => {
  it ("should return `some` of all elements except last", () => {
    expect (array.init ([])).toEqual (option.none)
    expect (array.init ([1])).toEqual (option.some ([]))
    expect (array.init ([1, 2, 3])).toEqual (option.some ([1, 2]))
  })
})

describe ("last", () => {
  it ("should return `some` of last element of an array", () => {
    expect (array.last ([])).toEqual (option.none)
    expect (array.last ([1, 2, 3])).toEqual (option.some (3))
  })
})

describe ("tail", () => {
  it ("should return `some` of all elements except first", () => {
    expect (array.tail ([])).toEqual (option.none)
    expect (array.tail ([1])).toEqual (option.some ([]))
    expect (array.tail ([1, 2, 3])).toEqual (option.some ([2, 3]))
  })
})

describe ("lookup", () => {
  it ("should return `some` of element by index", () => {
    expect (array.lookup (-1) ([])).toEqual (option.none)
    expect (array.lookup (0) ([])).toEqual (option.none)
    expect (array.lookup (1) ([])).toEqual (option.none)
    expect (array.lookup (-1) ([1, 2, 3])).toEqual (option.none)
    expect (array.lookup (0) ([1, 2, 3])).toEqual (option.some (1))
    expect (array.lookup (2) ([1, 2, 3])).toEqual (option.some (3))
    expect (array.lookup (3) ([1, 2, 3])).toEqual (option.none)
  })
})

describe ("at", () => {
  it ("should return `some` of element by positive or negative index", () => {
    expect (array.at (-1) ([])).toEqual (option.none)
    expect (array.at (0) ([])).toEqual (option.none)
    expect (array.at (1) ([])).toEqual (option.none)
    expect (array.at (-4) ([1, 2, 3])).toEqual (option.none)
    expect (array.at (-2) ([1, 2, 3])).toEqual (option.some (2))
    expect (array.at (-1) ([1, 2, 3])).toEqual (option.some (3))
    expect (array.at (0) ([1, 2, 3])).toEqual (option.some (1))
    expect (array.at (2) ([1, 2, 3])).toEqual (option.some (3))
    expect (array.at (3) ([1, 2, 3])).toEqual (option.none)
  })
})

describe ("isOutOfBounds", () => {
  it ("should return `true` if array has no the index", () => {
    expect (array.isOutOfBounds (-1) ([])).toBe (true)
    expect (array.isOutOfBounds (0) ([])).toBe (true)
    expect (array.isOutOfBounds (1) ([])).toBe (true)
    expect (array.isOutOfBounds (0) ([1, 2, 3])).toBe (false)
    expect (array.isOutOfBounds (2) ([1, 2, 3])).toBe (false)
    expect (array.isOutOfBounds (3) ([1, 2, 3])).toBe (true)
  })
})

describe ("findMap", () => {
  it ("should return `some` of found mapped element", () => {
    const p = number.matchOdd ({
      onOdd: option.zero,
      onEven: flow (number.add (10), option.some),
    })
    const f = array.findMap (p)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (12))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (12))
  })

  it ("should return `some` of found with index mapped element", () => {
    const f = array.findMap<number, string> ((a, i) =>
      pipe (
        i,
        number.isEven,
        boolean.and (a > 1),
        boolean.match ({
          onFalse: option.zero,
          onTrue: () => option.some (`${a}-${i}`),
        }),
      ),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.none)
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some ("3-2"))
  })
})

describe ("find", () => {
  it ("should return `some` of found element", () => {
    const f = array.find (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (2))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (2))
  })

  it ("should return `some` of found with index element", () => {
    const f = array.find<number> ((a, i) =>
      pipe (i, number.isEven, boolean.and (a > 1)),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.none)
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (3))
  })
})

describe ("findIndex", () => {
  it ("should return `some` of found element", () => {
    const f = array.findIndex (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (1))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (1))
  })

  it ("should return `some` of found with index element", () => {
    const f = array.findIndex<number> ((a, i) =>
      pipe (i, number.isEven, boolean.and (a > 1)),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.none)
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (2))
  })
})

describe ("findLastMap", () => {
  it ("should return `some` of last found mapped element", () => {
    const p = number.matchOdd ({
      onOdd: option.zero,
      onEven: flow (number.add (10), option.some),
    })
    const f = array.findLastMap (p)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (12))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (14))
  })

  it ("should return `some` of found with index mapped element", () => {
    const f = array.findLastMap<number, string> ((a, i) =>
      pipe (
        i,
        number.isOdd,
        boolean.and (a > 1),
        boolean.match ({
          onFalse: option.zero,
          onTrue: () => option.some (`${a}-${i}`),
        }),
      ),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2, 3], f, expect).toEqual (option.some ("2-1"))
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual (option.some ("4-3"))
  })
})

describe ("findLast", () => {
  it ("should return `some` of last found element", () => {
    const f = array.findLast (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (2))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (4))
  })

  it ("should return `some` of last found with index element", () => {
    const f = array.findLast<number> ((a, i) =>
      pipe (i, number.isOdd, boolean.and (a > 1)),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2, 3], f, expect).toEqual (option.some (2))
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual (option.some (4))
  })
})

describe ("findLastIndex", () => {
  it ("should return `some` of found element", () => {
    const f = array.findLastIndex (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (1))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (3))
  })

  it ("should return `some` of found with index element", () => {
    const f = array.findLastIndex<number> ((a, i) =>
      pipe (i, number.isOdd, boolean.and (a > 1)),
    )

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2, 3], f, expect).toEqual (option.some (1))
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual (option.some (3))
  })
})

describe ("elem", () => {
  it ("should return `true` if element is in array", () => {
    const f = array.elem (number.Equivalence)

    pipe ([], f (2), expect).toBe (false)
    pipe ([1], f (2), expect).toBe (false)
    pipe ([1, 2, 3], f (2), expect).toBe (true)
  })
})

describe ("every", () => {
  it ("should return `true` if every element match predicate", () => {
    const f = array.every (number.isEven)

    pipe ([], f, expect).toBe (true)
    pipe ([1], f, expect).toBe (false)
    pipe ([1, 2, 3], f, expect).toBe (false)
    pipe ([2, 4, 6], f, expect).toBe (true)
  })

  it ("should return `true` if every element match predicate with index", () => {
    const f = array.every<number> ((a, i) =>
      pipe (i, number.lessThan (3), pipe (a, number.lessThan (2), boolean.and)),
    )

    pipe ([], f, expect).toBe (true)
    pipe ([1], f, expect).toBe (true)
    pipe ([1, 1], f, expect).toBe (true)
    pipe ([1, 2], f, expect).toBe (false)
    pipe ([1, 2, 3], f, expect).toBe (false)
  })
})

describe ("exists", () => {
  it ("should return `true` if array has element which matches predicate", () => {
    const f = array.exists (number.isEven)

    pipe ([], f, expect).toBe (false)
    pipe ([1], f, expect).toBe (false)
    pipe ([1, 2, 3], f, expect).toBe (true)
    pipe ([1, 3, 5], f, expect).toBe (false)
  })

  it ("should return `true` if array has element which matches predicate with index", () => {
    const f = array.exists ((a, i) =>
      pipe (i, number.isEven, pipe (a, number.lessThan (2), boolean.and)),
    )

    pipe ([], f, expect).toBe (false)
    pipe ([1], f, expect).toBe (true)
    pipe ([2, 2, 2], f, expect).toBe (false)
    pipe ([2, 1, 2], f, expect).toBe (false)
    pipe ([2, 2, 1], f, expect).toBe (true)
  })
})

describe ("failures", () => {
  it ("should return array of failures", () => {
    pipe ([], array.failures, expect).toEqual ([])
    pipe ([result.succeed (1)], array.failures, expect).toEqual ([])
    pipe ([result.fail (1), result.succeed (2)], array.failures, expect).toEqual ([
      1,
    ])
    pipe (
      [result.fail (1), result.succeed (2), result.fail (3)],
      array.failures,
      expect,
    ).toEqual ([1, 3])
  })
})

describe ("successes", () => {
  it ("should return array of successes", () => {
    pipe ([], array.successes, expect).toEqual ([])
    pipe ([result.fail (1)], array.successes, expect).toEqual ([])
    pipe ([result.succeed (1), result.fail (2)], array.successes, expect).toEqual ([
      1,
    ])
    pipe (
      [result.succeed (1), result.fail (2), result.succeed (3)],
      array.successes,
      expect,
    ).toEqual ([1, 3])
  })
})

describe ("concat", () => {
  it ("should concat two arrays", () => {
    pipe ([], array.concat ([1, 2]), expect).toEqual ([1, 2])
    pipe ([1], array.concat ([2, 3]), expect).toEqual ([1, 2, 3])
    pipe ([1], array.concat<number> ([]), expect).toEqual ([1])
  })
})

describe ("prepend", () => {
  it ("should add element to the start of array", () => {
    pipe ([], array.prepend (1), expect).toEqual ([1])
    pipe ([2, 3], array.prepend (1), expect).toEqual ([1, 2, 3])
  })
})

describe ("prependAllWith", () => {
  it ("should add mapped element before each element", () => {
    const f = array.prependAllWith (number.add (10))
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([11, 1, 12, 2])
  })
})

describe ("prependAll", () => {
  it ("should add element before each element", () => {
    const f = array.prependAll (0)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([0, 1, 0, 2])
  })
})

describe ("append", () => {
  it ("should add element to the end of array", () => {
    pipe ([], array.append (1), expect).toEqual ([1])
    pipe ([2, 3], array.append (1), expect).toEqual ([2, 3, 1])
  })
})

describe ("appendAllWith", () => {
  it ("should add mapped element after each element", () => {
    const f = array.appendAllWith (number.add (10))
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 11, 2, 12])
  })
})

describe ("appendAll", () => {
  it ("should add element after each element", () => {
    const f = array.appendAll (0)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 0, 2, 0])
  })
})

describe ("range", () => {
  it ("should generate an array of numbers by given range from min to max value", () => {
    pipe (0, array.range (0), expect).toEqual ([0])
    pipe (1, array.range (5), expect).toEqual ([1, 2, 3, 4, 5])
    pipe (5, array.range (1), expect).toEqual ([5, 4, 3, 2, 1])
  })
})

describe ("reverse", () => {
  it ("should reverse an array", () => {
    expect (array.reverse ([])).toEqual ([])
    expect (array.reverse ([1])).toEqual ([1])
    expect (array.reverse ([1, 2, 3])).toEqual ([3, 2, 1])
  })
})

describe ("sort", () => {
  it ("should sort an array by provided `Order` instance", () => {
    pipe ([], array.sort (number.Order), expect).toEqual ([])
    pipe ([1], array.sort (number.Order), expect).toEqual ([1])
    pipe ([5, 2, 1, 3, 4], array.sort (number.Order), expect).toEqual ([
      1, 2, 3, 4, 5,
    ])
  })
})

describe ("sortBy", () => {
  it ("should sort an array by provided `Order` instances", () => {
    interface User {
      readonly id: number
      readonly name: string
      readonly isActive: boolean
    }

    const users: ReadonlyArray<User> = [
      { id: 1, name: "Bob", isActive: false },
      { id: 2, name: "Alex", isActive: true },
      { id: 3, name: "Dylan", isActive: true },
      { id: 4, name: "Clare", isActive: false },
    ]

    pipe (users, array.sortBy ([]), expect).toEqual (users)

    pipe (
      users,
      array.sortBy ([
        pipe (
          string.Order,
          order.contramap (({ name }) => name),
        ),
      ]),
      expect,
    ).toEqual<ReadonlyArray<User>> ([
      { id: 2, name: "Alex", isActive: true },
      { id: 1, name: "Bob", isActive: false },
      { id: 4, name: "Clare", isActive: false },
      { id: 3, name: "Dylan", isActive: true },
    ])

    pipe (
      users,
      array.sortBy ([
        pipe (
          string.Order,
          order.contramap (({ name }) => name),
        ),
        pipe (
          boolean.Order,
          order.reverse,
          order.contramap (({ isActive }) => isActive),
        ),
      ]),
      expect,
    ).toEqual<ReadonlyArray<User>> ([
      { id: 2, name: "Alex", isActive: true },
      { id: 3, name: "Dylan", isActive: true },
      { id: 1, name: "Bob", isActive: false },
      { id: 4, name: "Clare", isActive: false },
    ])
  })
})

describe ("join", () => {
  it ("should concat all strings", () => {
    expect (array.join (",") ([])).toEqual ("")
    expect (array.join (",") (["a"])).toEqual ("a")
    expect (array.join (",") (["a", "b", "c"])).toEqual ("a,b,c")
  })
})

describe ("zipWith", () => {
  it ("should zip arrays with provided function", () => {
    pipe (
      [],
      array.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([])
    pipe (
      [1, 2, 3],
      array.zipWith ([], (a, b) => a - b),
      expect,
    ).toEqual ([])
    pipe (
      [4, 6, 8],
      array.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4, 5])
    pipe (
      [4, 6],
      array.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4])
    pipe (
      [4, 6, 8],
      array.zipWith ([1, 2], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4])
  })
})

describe ("slice", () => {
  it ("should correctly slice an array", () => {
    pipe ([], array.slice (0), expect).toEqual ([])
    pipe ([], array.slice (1), expect).toEqual ([])
    pipe ([], array.slice (0, 2), expect).toEqual ([])
    pipe ([], array.slice (1, 2), expect).toEqual ([])
    pipe ([1, 2, 3], array.slice (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], array.slice (1), expect).toEqual ([2, 3])
    pipe ([1, 2, 3, 4], array.slice (0, 2), expect).toEqual ([1, 2])
    pipe ([1, 2, 3, 4], array.slice (1, 3), expect).toEqual ([2, 3])
  })
})

describe ("zipWith", () => {
  it ("should zip arrays with provided function", () => {
    pipe ([], array.zip ([3, 4, 5]), expect).toEqual ([])
    pipe ([1, 2, 3], array.zip ([]), expect).toEqual ([])
    pipe ([1, 2, 3], array.zip ([3, 4, 5]), expect).toEqual ([
      [1, 3],
      [2, 4],
      [3, 5],
    ])
    pipe ([1, 2], array.zip ([3, 4, 5]), expect).toEqual ([
      [1, 3],
      [2, 4],
    ])
    pipe ([1, 2, 3], array.zip ([3, 4]), expect).toEqual ([
      [1, 3],
      [2, 4],
    ])
  })
})

describe ("chunksOf", () => {
  it ("should correctly slice an array", () => {
    pipe ([], array.chunksOf (0), expect).toEqual ([])
    pipe ([], array.chunksOf (1), expect).toEqual ([])
    pipe ([1, 2, 3], array.chunksOf (-1), expect).toEqual ([])
    pipe ([1, 2, 3], array.chunksOf (0), expect).toEqual ([])
    pipe ([1, 2, 3], array.chunksOf (1), expect).toEqual ([[1], [2], [3]])
    pipe ([1, 2, 3], array.chunksOf (2), expect).toEqual ([[1, 2], [3]])
    pipe ([1, 2, 3], array.chunksOf (3), expect).toEqual ([[1, 2, 3]])
    pipe ([1, 2, 3], array.chunksOf (4), expect).toEqual ([[1, 2, 3]])
  })
})

describe ("takeLeftWhile", () => {
  it ("should take elements from the start of an array while predicate holds true", () => {
    const f = array.takeLeftWhile<number> ((a, i) => a + i < 6)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2, 3], f, expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([1, 2, 3])
    pipe ([6, 7, 8], f, expect).toEqual ([])
  })
})

describe ("takeLeft", () => {
  it ("should take n elements from the start of an array", () => {
    pipe ([], array.takeLeft (0), expect).toEqual ([])
    pipe ([], array.takeLeft (2), expect).toEqual ([])
    pipe ([], array.takeLeft (-2), expect).toEqual ([])
    pipe ([1, 2, 3], array.takeLeft (0), expect).toEqual ([])
    pipe ([1, 2, 3], array.takeLeft (2), expect).toEqual ([1, 2])
    pipe ([1, 2, 3], array.takeLeft (-2), expect).toEqual ([])
  })
})

describe ("takeRightWhile", () => {
  it ("should take elements from the end of an array while predicate holds true", () => {
    pipe (
      [],
      array.takeRightWhile ((a, i) => a + i > 0),
      expect,
    ).toEqual ([])
    pipe (
      [1, 2, 3],
      array.takeRightWhile ((a, i) => a + i > 0),
      expect,
    ).toEqual ([1, 2, 3])
    pipe (
      [1, 2, 3, 4, 5],
      array.takeRightWhile ((a, i) => a + i > 3),
      expect,
    ).toEqual ([3, 4, 5])
  })
})

describe ("takeRight", () => {
  it ("should take n elements from the end of an array", () => {
    pipe ([], array.takeRight (0), expect).toEqual ([])
    pipe ([], array.takeRight (2), expect).toEqual ([])
    pipe ([], array.takeRight (-2), expect).toEqual ([])
    pipe ([1, 2, 3], array.takeRight (0), expect).toEqual ([])
    pipe ([1, 2, 3], array.takeRight (2), expect).toEqual ([2, 3])
    pipe ([1, 2, 3], array.takeRight (-2), expect).toEqual ([])
  })
})

describe ("dropLeftWhile", () => {
  it ("should drop elements from the start of an array while predicate holds true", () => {
    const f = array.dropLeftWhile<number> ((a, i) => a + i < 6)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2, 3], f, expect).toEqual ([])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([4, 5])
    pipe ([6, 7, 8], f, expect).toEqual ([6, 7, 8])
  })
})

describe ("dropLeft", () => {
  it ("should drop n elements from the start of an array", () => {
    pipe ([], array.dropLeft (0), expect).toEqual ([])
    pipe ([], array.dropLeft (2), expect).toEqual ([])
    pipe ([], array.dropLeft (-2), expect).toEqual ([])
    pipe ([1, 2, 3], array.dropLeft (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], array.dropLeft (2), expect).toEqual ([3])
    pipe ([1, 2, 3], array.dropLeft (-2), expect).toEqual ([1, 2, 3])
  })
})

describe ("dropRightWhile", () => {
  it ("should drop elements from the end of an array while predicate holds true", () => {
    const f = array.dropRightWhile<number> ((a, i) => a + i > 3)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 2])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([1, 2])
    pipe ([6, 7, 8], f, expect).toEqual ([])
  })
})

describe ("dropRight", () => {
  it ("should drop n elements from the end of an array", () => {
    pipe ([], array.dropRight (0), expect).toEqual ([])
    pipe ([], array.dropRight (2), expect).toEqual ([])
    pipe ([], array.dropRight (-2), expect).toEqual ([])
    pipe ([1, 2, 3], array.dropRight (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], array.dropRight (2), expect).toEqual ([1])
    pipe ([1, 2, 3], array.dropRight (-2), expect).toEqual ([1, 2, 3])
  })
})

describe ("dropBothWhile", () => {
  it ("should drop elements from the start and the end of an array while predicate holds true", () => {
    const f = array.dropBothWhile<number> ((a, i) => a + i < 4 || a + i > 7)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([3, 4])
    pipe (
      [1, 2, 3, 4],
      array.dropBothWhile (flow (number.equals (3), boolean.not)),
      expect,
    ).toEqual ([3])
  })
})

describe ("comprehension", () => {
  it ("should correctly generate an array without predicate", () => {
    expect (array.comprehension ([[1, 2, 3, 4, 5]], number.add (1))).toEqual ([
      2, 3, 4, 5, 6,
    ])
    expect (
      array.comprehension (
        [
          [1, 2, 3, 4, 5],
          ["a", "b", "c"],
        ],
        (num, str) => [num, str],
      ),
    ).toEqual ([
      [1, "a"],
      [1, "b"],
      [1, "c"],
      [2, "a"],
      [2, "b"],
      [2, "c"],
      [3, "a"],
      [3, "b"],
      [3, "c"],
      [4, "a"],
      [4, "b"],
      [4, "c"],
      [5, "a"],
      [5, "b"],
      [5, "c"],
    ])
    expect (
      array.comprehension (
        [[1, 2, 3, 4, 5], [], ["a", "b", "c"]],
        (num, _, str) => [num, str],
      ),
    ).toEqual ([])
    expect (
      array.comprehension (
        [
          ["a", "b"],
          ["a", "b"],
          ["a", "b"],
        ],
        (a, b, c) => `${a}${b}${c}`,
      ),
    ).toEqual (["aaa", "aab", "aba", "abb", "baa", "bab", "bba", "bbb"])
  })

  it ("should correctly generate an array with predicate", () => {
    expect (
      array.comprehension ([[1, 2, 3, 4, 5]], number.add (1), number.isEven),
    ).toEqual ([3, 5])
    expect (
      array.comprehension (
        [
          [1, 2, 3, 4, 5],
          ["a", "b", "c"],
        ],
        (num, str) => [num, str],
        num => number.isEven (num),
      ),
    ).toEqual ([
      [2, "a"],
      [2, "b"],
      [2, "c"],
      [4, "a"],
      [4, "b"],
      [4, "c"],
    ])
    expect (
      array.comprehension (
        [[1, 2, 3, 4, 5], [], ["a", "b", "c"]],
        (num, _, str) => [num, str],
        num => number.isEven (num),
      ),
    ).toEqual ([])
    expect (
      array.comprehension (
        [
          ["a", "b"],
          ["a", "b"],
          ["a", "b"],
        ],
        (a, b, c) => `${a}${b}${c}`,
        (_, b) => b !== "a",
      ),
    ).toEqual (["aba", "abb", "bba", "bbb"])
  })
})
