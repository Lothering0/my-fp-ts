import {
  option,
  readonlyArray,
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
    expect (readonlyArray.head ([])).toEqual (option.none)
    expect (readonlyArray.head ([1, 2, 3])).toEqual (option.some (1))
  })
})

describe ("init", () => {
  it ("should return `some` of all elements except last", () => {
    expect (readonlyArray.init ([])).toEqual (option.none)
    expect (readonlyArray.init ([1])).toEqual (option.some ([]))
    expect (readonlyArray.init ([1, 2, 3])).toEqual (option.some ([1, 2]))
  })
})

describe ("last", () => {
  it ("should return `some` of last element of an array", () => {
    expect (readonlyArray.last ([])).toEqual (option.none)
    expect (readonlyArray.last ([1, 2, 3])).toEqual (option.some (3))
  })
})

describe ("tail", () => {
  it ("should return `some` of all elements except first", () => {
    expect (readonlyArray.tail ([])).toEqual (option.none)
    expect (readonlyArray.tail ([1])).toEqual (option.some ([]))
    expect (readonlyArray.tail ([1, 2, 3])).toEqual (option.some ([2, 3]))
  })
})

describe ("lookup", () => {
  it ("should return `some` of element by index", () => {
    expect (readonlyArray.lookup (-1) ([])).toEqual (option.none)
    expect (readonlyArray.lookup (0) ([])).toEqual (option.none)
    expect (readonlyArray.lookup (1) ([])).toEqual (option.none)
    expect (readonlyArray.lookup (-1) ([1, 2, 3])).toEqual (option.none)
    expect (readonlyArray.lookup (0) ([1, 2, 3])).toEqual (option.some (1))
    expect (readonlyArray.lookup (2) ([1, 2, 3])).toEqual (option.some (3))
    expect (readonlyArray.lookup (3) ([1, 2, 3])).toEqual (option.none)
  })
})

describe ("at", () => {
  it ("should return `some` of element by positive or negative index", () => {
    expect (readonlyArray.at (-1) ([])).toEqual (option.none)
    expect (readonlyArray.at (0) ([])).toEqual (option.none)
    expect (readonlyArray.at (1) ([])).toEqual (option.none)
    expect (readonlyArray.at (-4) ([1, 2, 3])).toEqual (option.none)
    expect (readonlyArray.at (-2) ([1, 2, 3])).toEqual (option.some (2))
    expect (readonlyArray.at (-1) ([1, 2, 3])).toEqual (option.some (3))
    expect (readonlyArray.at (0) ([1, 2, 3])).toEqual (option.some (1))
    expect (readonlyArray.at (2) ([1, 2, 3])).toEqual (option.some (3))
    expect (readonlyArray.at (3) ([1, 2, 3])).toEqual (option.none)
  })
})

describe ("isOutOfBounds", () => {
  it ("should return `true` if array has no the index", () => {
    expect (readonlyArray.isOutOfBounds (-1) ([])).toBe (true)
    expect (readonlyArray.isOutOfBounds (0) ([])).toBe (true)
    expect (readonlyArray.isOutOfBounds (1) ([])).toBe (true)
    expect (readonlyArray.isOutOfBounds (0) ([1, 2, 3])).toBe (false)
    expect (readonlyArray.isOutOfBounds (2) ([1, 2, 3])).toBe (false)
    expect (readonlyArray.isOutOfBounds (3) ([1, 2, 3])).toBe (true)
  })
})

describe ("findMap", () => {
  it ("should return `some` of found mapped element", () => {
    const p = number.matchOdd ({
      onOdd: option.zero,
      onEven: flow (number.add (10), option.some),
    })
    const f = readonlyArray.findMap (p)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (12))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (12))
  })

  it ("should return `some` of found with index mapped element", () => {
    const f = readonlyArray.findMap<number, string> ((a, i) =>
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
    const f = readonlyArray.find (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (2))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (2))
  })

  it ("should return `some` of found with index element", () => {
    const f = readonlyArray.find<number> ((a, i) =>
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
    const f = readonlyArray.findIndex (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (1))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (1))
  })

  it ("should return `some` of found with index element", () => {
    const f = readonlyArray.findIndex<number> ((a, i) =>
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
    const f = readonlyArray.findLastMap (p)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (12))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (14))
  })

  it ("should return `some` of found with index mapped element", () => {
    const f = readonlyArray.findLastMap<number, string> ((a, i) =>
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
    const f = readonlyArray.findLast (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (2))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (4))
  })

  it ("should return `some` of last found with index element", () => {
    const f = readonlyArray.findLast<number> ((a, i) =>
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
    const f = readonlyArray.findLastIndex (number.isEven)

    pipe ([], f, expect).toEqual (option.none)
    pipe ([1], f, expect).toEqual (option.none)
    pipe ([1, 2], f, expect).toEqual (option.some (1))
    pipe ([1, 2, 3, 4], f, expect).toEqual (option.some (3))
  })

  it ("should return `some` of found with index element", () => {
    const f = readonlyArray.findLastIndex<number> ((a, i) =>
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
    const f = readonlyArray.elem (number.Equivalence)

    pipe ([], f (2), expect).toBe (false)
    pipe ([1], f (2), expect).toBe (false)
    pipe ([1, 2, 3], f (2), expect).toBe (true)
  })
})

describe ("every", () => {
  it ("should return `true` if every element match predicate", () => {
    const f = readonlyArray.every (number.isEven)

    pipe ([], f, expect).toBe (true)
    pipe ([1], f, expect).toBe (false)
    pipe ([1, 2, 3], f, expect).toBe (false)
    pipe ([2, 4, 6], f, expect).toBe (true)
  })

  it ("should return `true` if every element match predicate with index", () => {
    const f = readonlyArray.every<number> ((a, i) =>
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
    const f = readonlyArray.exists (number.isEven)

    pipe ([], f, expect).toBe (false)
    pipe ([1], f, expect).toBe (false)
    pipe ([1, 2, 3], f, expect).toBe (true)
    pipe ([1, 3, 5], f, expect).toBe (false)
  })

  it ("should return `true` if array has element which matches predicate with index", () => {
    const f = readonlyArray.exists ((a, i) =>
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
    pipe ([], readonlyArray.failures, expect).toEqual ([])
    pipe ([result.succeed (1)], readonlyArray.failures, expect).toEqual ([])
    pipe (
      [result.fail (1), result.succeed (2)],
      readonlyArray.failures,
      expect,
    ).toEqual ([1])
    pipe (
      [result.fail (1), result.succeed (2), result.fail (3)],
      readonlyArray.failures,
      expect,
    ).toEqual ([1, 3])
  })
})

describe ("successes", () => {
  it ("should return array of successes", () => {
    pipe ([], readonlyArray.successes, expect).toEqual ([])
    pipe ([result.fail (1)], readonlyArray.successes, expect).toEqual ([])
    pipe (
      [result.succeed (1), result.fail (2)],
      readonlyArray.successes,
      expect,
    ).toEqual ([1])
    pipe (
      [result.succeed (1), result.fail (2), result.succeed (3)],
      readonlyArray.successes,
      expect,
    ).toEqual ([1, 3])
  })
})

describe ("concat", () => {
  it ("should concat two arrays", () => {
    pipe ([], readonlyArray.concat ([1, 2]), expect).toEqual ([1, 2])
    pipe ([1], readonlyArray.concat ([2, 3]), expect).toEqual ([1, 2, 3])
    pipe ([1], readonlyArray.concat<number> ([]), expect).toEqual ([1])
  })
})

describe ("prepend", () => {
  it ("should add element to the start of array", () => {
    pipe ([], readonlyArray.prepend (1), expect).toEqual ([1])
    pipe ([2, 3], readonlyArray.prepend (1), expect).toEqual ([1, 2, 3])
  })
})

describe ("prependAllWith", () => {
  it ("should add mapped element before each element", () => {
    const f = readonlyArray.prependAllWith (number.add (10))
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([11, 1, 12, 2])
  })
})

describe ("prependAll", () => {
  it ("should add element before each element", () => {
    const f = readonlyArray.prependAll (0)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([0, 1, 0, 2])
  })
})

describe ("append", () => {
  it ("should add element to the end of array", () => {
    pipe ([], readonlyArray.append (1), expect).toEqual ([1])
    pipe ([2, 3], readonlyArray.append (1), expect).toEqual ([2, 3, 1])
  })
})

describe ("appendAllWith", () => {
  it ("should add mapped element after each element", () => {
    const f = readonlyArray.appendAllWith (number.add (10))
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 11, 2, 12])
  })
})

describe ("appendAll", () => {
  it ("should add element after each element", () => {
    const f = readonlyArray.appendAll (0)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 0, 2, 0])
  })
})

describe ("range", () => {
  it ("should generate an array of numbers by given range from min to max value", () => {
    pipe (0, readonlyArray.range (0), expect).toEqual ([0])
    pipe (1, readonlyArray.range (5), expect).toEqual ([1, 2, 3, 4, 5])
    pipe (5, readonlyArray.range (1), expect).toEqual ([5, 4, 3, 2, 1])
  })
})

describe ("reverse", () => {
  it ("should reverse an array", () => {
    expect (readonlyArray.reverse ([])).toEqual ([])
    expect (readonlyArray.reverse ([1])).toEqual ([1])
    expect (readonlyArray.reverse ([1, 2, 3])).toEqual ([3, 2, 1])
  })
})

describe ("sort", () => {
  it ("should sort an array by provided `Order` instance", () => {
    pipe ([], readonlyArray.sort (number.Order), expect).toEqual ([])
    pipe ([1], readonlyArray.sort (number.Order), expect).toEqual ([1])
    pipe ([5, 2, 1, 3, 4], readonlyArray.sort (number.Order), expect).toEqual ([
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

    pipe (users, readonlyArray.sortBy ([]), expect).toEqual (users)

    pipe (
      users,
      readonlyArray.sortBy ([
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
      readonlyArray.sortBy ([
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
    expect (readonlyArray.join (",") ([])).toEqual ("")
    expect (readonlyArray.join (",") (["a"])).toEqual ("a")
    expect (readonlyArray.join (",") (["a", "b", "c"])).toEqual ("a,b,c")
  })
})

describe ("zipWith", () => {
  it ("should zip arrays with provided function", () => {
    pipe (
      [],
      readonlyArray.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([])
    pipe (
      [1, 2, 3],
      readonlyArray.zipWith ([], (a, b) => a - b),
      expect,
    ).toEqual ([])
    pipe (
      [4, 6, 8],
      readonlyArray.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4, 5])
    pipe (
      [4, 6],
      readonlyArray.zipWith ([1, 2, 3], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4])
    pipe (
      [4, 6, 8],
      readonlyArray.zipWith ([1, 2], (a, b) => a - b),
      expect,
    ).toEqual ([3, 4])
  })
})

describe ("slice", () => {
  it ("should correctly slice an array", () => {
    pipe ([], readonlyArray.slice (0), expect).toEqual ([])
    pipe ([], readonlyArray.slice (1), expect).toEqual ([])
    pipe ([], readonlyArray.slice (0, 2), expect).toEqual ([])
    pipe ([], readonlyArray.slice (1, 2), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.slice (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], readonlyArray.slice (1), expect).toEqual ([2, 3])
    pipe ([1, 2, 3, 4], readonlyArray.slice (0, 2), expect).toEqual ([1, 2])
    pipe ([1, 2, 3, 4], readonlyArray.slice (1, 3), expect).toEqual ([2, 3])
  })
})

describe ("zipWith", () => {
  it ("should zip arrays with provided function", () => {
    pipe ([], readonlyArray.zip ([3, 4, 5]), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.zip ([]), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.zip ([3, 4, 5]), expect).toEqual ([
      [1, 3],
      [2, 4],
      [3, 5],
    ])
    pipe ([1, 2], readonlyArray.zip ([3, 4, 5]), expect).toEqual ([
      [1, 3],
      [2, 4],
    ])
    pipe ([1, 2, 3], readonlyArray.zip ([3, 4]), expect).toEqual ([
      [1, 3],
      [2, 4],
    ])
  })
})

describe ("chunksOf", () => {
  it ("should correctly slice an array", () => {
    pipe ([], readonlyArray.chunksOf (0), expect).toEqual ([])
    pipe ([], readonlyArray.chunksOf (1), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.chunksOf (-1), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.chunksOf (0), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.chunksOf (1), expect).toEqual ([[1], [2], [3]])
    pipe ([1, 2, 3], readonlyArray.chunksOf (2), expect).toEqual ([[1, 2], [3]])
    pipe ([1, 2, 3], readonlyArray.chunksOf (3), expect).toEqual ([[1, 2, 3]])
    pipe ([1, 2, 3], readonlyArray.chunksOf (4), expect).toEqual ([[1, 2, 3]])
  })
})

describe ("takeLeftWhile", () => {
  it ("should take elements from the start of an array while predicate holds true", () => {
    const f = readonlyArray.takeLeftWhile<number> ((a, i) => a + i < 6)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2, 3], f, expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([1, 2, 3])
    pipe ([6, 7, 8], f, expect).toEqual ([])
  })
})

describe ("takeLeft", () => {
  it ("should take n elements from the start of an array", () => {
    pipe ([], readonlyArray.takeLeft (0), expect).toEqual ([])
    pipe ([], readonlyArray.takeLeft (2), expect).toEqual ([])
    pipe ([], readonlyArray.takeLeft (-2), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.takeLeft (0), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.takeLeft (2), expect).toEqual ([1, 2])
    pipe ([1, 2, 3], readonlyArray.takeLeft (-2), expect).toEqual ([])
  })
})

describe ("takeRightWhile", () => {
  it ("should take elements from the end of an array while predicate holds true", () => {
    pipe (
      [],
      readonlyArray.takeRightWhile ((a, i) => a + i > 0),
      expect,
    ).toEqual ([])
    pipe (
      [1, 2, 3],
      readonlyArray.takeRightWhile ((a, i) => a + i > 0),
      expect,
    ).toEqual ([1, 2, 3])
    pipe (
      [1, 2, 3, 4, 5],
      readonlyArray.takeRightWhile ((a, i) => a + i > 3),
      expect,
    ).toEqual ([3, 4, 5])
  })
})

describe ("takeRight", () => {
  it ("should take n elements from the end of an array", () => {
    pipe ([], readonlyArray.takeRight (0), expect).toEqual ([])
    pipe ([], readonlyArray.takeRight (2), expect).toEqual ([])
    pipe ([], readonlyArray.takeRight (-2), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.takeRight (0), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.takeRight (2), expect).toEqual ([2, 3])
    pipe ([1, 2, 3], readonlyArray.takeRight (-2), expect).toEqual ([])
  })
})

describe ("dropLeftWhile", () => {
  it ("should drop elements from the start of an array while predicate holds true", () => {
    const f = readonlyArray.dropLeftWhile<number> ((a, i) => a + i < 6)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2, 3], f, expect).toEqual ([])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([4, 5])
    pipe ([6, 7, 8], f, expect).toEqual ([6, 7, 8])
  })
})

describe ("dropLeft", () => {
  it ("should drop n elements from the start of an array", () => {
    pipe ([], readonlyArray.dropLeft (0), expect).toEqual ([])
    pipe ([], readonlyArray.dropLeft (2), expect).toEqual ([])
    pipe ([], readonlyArray.dropLeft (-2), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.dropLeft (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], readonlyArray.dropLeft (2), expect).toEqual ([3])
    pipe ([1, 2, 3], readonlyArray.dropLeft (-2), expect).toEqual ([1, 2, 3])
  })
})

describe ("dropRightWhile", () => {
  it ("should drop elements from the end of an array while predicate holds true", () => {
    const f = readonlyArray.dropRightWhile<number> ((a, i) => a + i > 3)
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([1, 2])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([1, 2])
    pipe ([6, 7, 8], f, expect).toEqual ([])
  })
})

describe ("dropRight", () => {
  it ("should drop n elements from the end of an array", () => {
    pipe ([], readonlyArray.dropRight (0), expect).toEqual ([])
    pipe ([], readonlyArray.dropRight (2), expect).toEqual ([])
    pipe ([], readonlyArray.dropRight (-2), expect).toEqual ([])
    pipe ([1, 2, 3], readonlyArray.dropRight (0), expect).toEqual ([1, 2, 3])
    pipe ([1, 2, 3], readonlyArray.dropRight (2), expect).toEqual ([1])
    pipe ([1, 2, 3], readonlyArray.dropRight (-2), expect).toEqual ([1, 2, 3])
  })
})

describe ("dropBothWhile", () => {
  it ("should drop elements from the start and the end of an array while predicate holds true", () => {
    const f = readonlyArray.dropBothWhile<number> (
      (a, i) => a + i < 4 || a + i > 7,
    )
    pipe ([], f, expect).toEqual ([])
    pipe ([1, 2], f, expect).toEqual ([])
    pipe ([1, 2, 3, 4, 5], f, expect).toEqual ([3, 4])
    pipe (
      [1, 2, 3, 4],
      readonlyArray.dropBothWhile (flow (number.equals (3), boolean.not)),
      expect,
    ).toEqual ([3])
  })
})

describe ("comprehension", () => {
  it ("should correctly generate an array without predicate", () => {
    expect (
      readonlyArray.comprehension ([[1, 2, 3, 4, 5]], number.add (1)),
    ).toEqual ([2, 3, 4, 5, 6])
    expect (
      readonlyArray.comprehension (
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
      readonlyArray.comprehension (
        [[1, 2, 3, 4, 5], [], ["a", "b", "c"]],
        (num, _, str) => [num, str],
      ),
    ).toEqual ([])
    expect (
      readonlyArray.comprehension (
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
      readonlyArray.comprehension (
        [[1, 2, 3, 4, 5]],
        number.add (1),
        number.isEven,
      ),
    ).toEqual ([3, 5])
    expect (
      readonlyArray.comprehension (
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
      readonlyArray.comprehension (
        [[1, 2, 3, 4, 5], [], ["a", "b", "c"]],
        (num, _, str) => [num, str],
        num => number.isEven (num),
      ),
    ).toEqual ([])
    expect (
      readonlyArray.comprehension (
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
