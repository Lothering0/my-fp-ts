import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"

interface TestCase {
  readonly description: string
  readonly option1: O.Option<number>
  readonly option2: O.Option<number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = O.getEq (N.Eq)

  const testCases: TestCase[] = [
    {
      description: "should return `true` for nones",
      option1: O.none,
      option2: O.none,
      expected: true,
    },
    {
      description:
        "should return `false` if first is `none` and second is `some`",
      option1: O.some (1),
      option2: O.none,
      expected: false,
    },
    {
      description: "should return `false` for `some`s with different values",
      option1: O.some (0),
      option2: O.some (1),
      expected: false,
    },
    {
      description: "should return `true` for `some`s with same values",
      option1: O.some (1),
      option2: O.some (1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, option1, option2, expected }) =>
    it (description, () => expect (Eq.equals (option1) (option2)).toBe (expected)),
  )
})
