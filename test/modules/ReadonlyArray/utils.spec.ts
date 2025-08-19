import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as option from "../../../src/modules/Option"
import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import * as boolean from "../../../src/modules/Boolean"
import { flow, pipe } from "../../../src/utils/flow"

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
    const p = number.matchOdd (option.zero, flow (number.add (10), option.some))
    const f = readonlyArray.findMap (p)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (12))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (12))
  })
})

describe ("findMapWithIndex", () => {
  it ("should return `some` of found mapped element", () => {
    const f = readonlyArray.findMapWithIndex<number, string> ((i, a) =>
      pipe (
        i,
        number.isEven,
        boolean.and (a > 1),
        boolean.match (option.zero, () => option.some (`${a}-${i}`)),
      ),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some ("3-2"))
  })
})

describe ("find", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.find (number.isEven)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (2))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (2))
  })
})

describe ("findWithIndex", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.findWithIndex<number> ((i, a) =>
      pipe (i, number.isEven, boolean.and (a > 1)),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (3))
  })
})

describe ("findIndex", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.findIndex (number.isEven)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (1))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (1))
  })
})

describe ("findIndexWithIndex", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.findIndexWithIndex<number> ((i, a) =>
      pipe (i, number.isEven, boolean.and (a > 1)),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (2))
  })
})

describe ("findLastMap", () => {
  it ("should return `some` of last found mapped element", () => {
    const p = number.matchOdd (option.zero, flow (number.add (10), option.some))
    const f = readonlyArray.findLastMap (p)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (12))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (14))
  })
})

describe ("findLastMapWithIndex", () => {
  it ("should return `some` of found mapped element", () => {
    const f = readonlyArray.findLastMapWithIndex<number, string> ((i, a) =>
      pipe (
        i,
        number.isOdd,
        boolean.and (a > 1),
        boolean.match (option.zero, () => option.some (`${a}-${i}`)),
      ),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3], f)).toEqual (option.some ("2-1"))
    expect (pipe ([1, 2, 3, 4, 5], f)).toEqual (option.some ("4-3"))
  })
})

describe ("findLast", () => {
  it ("should return `some` of last found element", () => {
    const f = readonlyArray.findLast (number.isEven)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (2))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (4))
  })
})

describe ("findLastWithIndex", () => {
  it ("should return `some` of last found element", () => {
    const f = readonlyArray.findLastWithIndex<number> ((i, a) =>
      pipe (i, number.isOdd, boolean.and (a > 1)),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3], f)).toEqual (option.some (2))
    expect (pipe ([1, 2, 3, 4, 5], f)).toEqual (option.some (4))
  })
})

describe ("findLastIndex", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.findLastIndex (number.isEven)

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2], f)).toEqual (option.some (1))
    expect (pipe ([1, 2, 3, 4], f)).toEqual (option.some (3))
  })
})

describe ("findLastIndexWithIndex", () => {
  it ("should return `some` of found element", () => {
    const f = readonlyArray.findLastIndexWithIndex<number> ((i, a) =>
      pipe (i, number.isOdd, boolean.and (a > 1)),
    )

    expect (pipe ([], f)).toEqual (option.none)
    expect (pipe ([1], f)).toEqual (option.none)
    expect (pipe ([1, 2, 3], f)).toEqual (option.some (1))
    expect (pipe ([1, 2, 3, 4, 5], f)).toEqual (option.some (3))
  })
})

describe ("elem", () => {
  it ("should return `true` if element is in array", () => {
    const f = readonlyArray.elem (number.Eq)

    expect (pipe ([], f (2))).toBe (false)
    expect (pipe ([1], f (2))).toBe (false)
    expect (pipe ([1, 2, 3], f (2))).toBe (true)
  })
})

describe ("every", () => {
  it ("should return `true` if every element match predicate", () => {
    const f = readonlyArray.every (number.isEven)

    expect (pipe ([], f)).toBe (true)
    expect (pipe ([1], f)).toBe (false)
    expect (pipe ([1, 2, 3], f)).toBe (false)
    expect (pipe ([2, 4, 6], f)).toBe (true)
  })
})

describe ("everyWithIndex", () => {
  it ("should return `true` if every element match predicate", () => {
    const f = readonlyArray.everyWithIndex<number> ((i, a) =>
      pipe (i, number.lessThan (3), pipe (a, number.lessThan (2), boolean.and)),
    )

    expect (pipe ([], f)).toBe (true)
    expect (pipe ([1], f)).toBe (true)
    expect (pipe ([1, 1], f)).toBe (true)
    expect (pipe ([1, 2], f)).toBe (false)
    expect (pipe ([1, 2, 3], f)).toBe (false)
  })
})

describe ("exists", () => {
  it ("should return `true` if array has element which matches predicate", () => {
    const f = readonlyArray.exists (number.isEven)

    expect (pipe ([], f)).toBe (false)
    expect (pipe ([1], f)).toBe (false)
    expect (pipe ([1, 2, 3], f)).toBe (true)
    expect (pipe ([1, 3, 5], f)).toBe (false)
  })
})

describe ("existsWithIndex", () => {
  it ("should return `true` if array has element which matches predicate", () => {
    const f = readonlyArray.existsWithIndex ((i, a) =>
      pipe (i, number.isEven, pipe (a, number.lessThan (2), boolean.and)),
    )

    expect (pipe ([], f)).toBe (false)
    expect (pipe ([1], f)).toBe (true)
    expect (pipe ([2, 2, 2], f)).toBe (false)
    expect (pipe ([2, 1, 2], f)).toBe (false)
    expect (pipe ([2, 2, 1], f)).toBe (true)
  })
})

describe ("failures", () => {
  it ("should return array of failures", () => {
    expect (pipe ([], readonlyArray.failures)).toEqual ([])
    expect (pipe ([result.succeed (1)], readonlyArray.failures)).toEqual ([])
    expect (
      pipe ([result.fail (1), result.succeed (2)], readonlyArray.failures),
    ).toEqual ([1])
    expect (
      pipe (
        [result.fail (1), result.succeed (2), result.fail (3)],
        readonlyArray.failures,
      ),
    ).toEqual ([1, 3])
  })
})

describe ("successes", () => {
  it ("should return array of successes", () => {
    expect (pipe ([], readonlyArray.successes)).toEqual ([])
    expect (pipe ([result.fail (1)], readonlyArray.successes)).toEqual ([])
    expect (
      pipe ([result.succeed (1), result.fail (2)], readonlyArray.successes),
    ).toEqual ([1])
    expect (
      pipe (
        [result.succeed (1), result.fail (2), result.succeed (3)],
        readonlyArray.successes,
      ),
    ).toEqual ([1, 3])
  })
})

describe ("concat", () => {
  it ("should concat two arrays", () => {
    expect (pipe ([], readonlyArray.concat ([1, 2]))).toEqual ([1, 2])
    expect (pipe ([1], readonlyArray.concat ([2, 3]))).toEqual ([1, 2, 3])
    expect (pipe ([1], readonlyArray.concat<number> ([]))).toEqual ([1])
  })
})

describe ("prepend", () => {
  it ("should add element to the start of array", () => {
    expect (pipe ([], readonlyArray.prepend (1))).toEqual ([1])
    expect (pipe ([2, 3], readonlyArray.prepend (1))).toEqual ([1, 2, 3])
  })
})

describe ("prependAllWith", () => {
  it ("should add mapped element before each element", () => {
    const f = readonlyArray.prependAllWith (number.add (10))
    expect (pipe ([], f)).toEqual ([])
    expect (pipe ([1, 2], f)).toEqual ([11, 1, 12, 2])
  })
})

describe ("prependAll", () => {
  it ("should add element before each element", () => {
    const f = readonlyArray.prependAll (0)
    expect (pipe ([], f)).toEqual ([])
    expect (pipe ([1, 2], f)).toEqual ([0, 1, 0, 2])
  })
})

describe ("append", () => {
  it ("should add element to the end of array", () => {
    expect (pipe ([], readonlyArray.append (1))).toEqual ([1])
    expect (pipe ([2, 3], readonlyArray.append (1))).toEqual ([2, 3, 1])
  })
})

describe ("appendAllWith", () => {
  it ("should add mapped element after each element", () => {
    const f = readonlyArray.appendAllWith (number.add (10))
    expect (pipe ([], f)).toEqual ([])
    expect (pipe ([1, 2], f)).toEqual ([1, 11, 2, 12])
  })
})

describe ("appendAll", () => {
  it ("should add element after each element", () => {
    const f = readonlyArray.appendAll (0)
    expect (pipe ([], f)).toEqual ([])
    expect (pipe ([1, 2], f)).toEqual ([1, 0, 2, 0])
  })
})

describe ("range", () => {
  it ("should generate an array of numbers by given range from min to max value", () => {
    expect (readonlyArray.range (1) (5)).toEqual ([1, 2, 3, 4, 5])
    expect (readonlyArray.range (5) (1)).toEqual ([5, 4, 3, 2, 1])
    expect (readonlyArray.range (0) (0)).toEqual ([0])
  })
})

describe ("reverse", () => {
  it ("should reverse an array", () => {
    expect (readonlyArray.reverse ([])).toEqual ([])
    expect (readonlyArray.reverse ([1])).toEqual ([1])
    expect (readonlyArray.reverse ([1, 2, 3])).toEqual ([3, 2, 1])
  })
})

describe ("join", () => {
  it ("should concat all strings", () => {
    expect (readonlyArray.join (",") ([])).toEqual ("")
    expect (readonlyArray.join (",") (["a"])).toEqual ("a")
    expect (readonlyArray.join (",") (["a", "b", "c"])).toEqual ("a,b,c")
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
