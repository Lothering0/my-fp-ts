import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"

interface TestCase {
  readonly description: string
  readonly array1: ReadonlyArray<number>
  readonly array2: ReadonlyArray<number>
  readonly expected: boolean
}

describe ("getEquivalence", () => {
  const Equivalence = readonlyArray.getEquivalence (number.Equivalence)

  const testCases: ReadonlyArray<TestCase> = [
    {
      description: "should return `true` for empty arrays",
      array1: [],
      array2: [],
      expected: true,
    },
    {
      description: "should return `false` for arrays with different length",
      array1: [1, 2, 3],
      array2: [],
      expected: false,
    },
    {
      description: "should return `true` for same arrays",
      array1: [1, 2, 3],
      array2: [1, 2, 3],
      expected: true,
    },
    {
      description: "should return `false` for different arrays",
      array1: [1, 2, 3],
      array2: [1, 3, 2],
      expected: false,
    },
  ]

  testCases.forEach (({ description, array1, array2, expected }) =>
    it (description, () =>
      expect (Equivalence.equals (array1) (array2)).toBe (expected),
    ),
  )
})
