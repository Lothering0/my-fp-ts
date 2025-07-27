import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"

interface TestCase {
  readonly description: string
  readonly option1: option.Option<number>
  readonly option2: option.Option<number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = option.getEq (number.Eq)

  const testCases: TestCase[] = [
    {
      description: "should return `true` for nones",
      option1: option.none,
      option2: option.none,
      expected: true,
    },
    {
      description:
        "should return `false` if first is `none` and second is `some`",
      option1: option.some (1),
      option2: option.none,
      expected: false,
    },
    {
      description: "should return `false` for `some`s with different values",
      option1: option.some (0),
      option2: option.some (1),
      expected: false,
    },
    {
      description: "should return `true` for `some`s with same values",
      option1: option.some (1),
      option2: option.some (1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, option1, option2, expected }) =>
    it (description, () => expect (Eq.equals (option1) (option2)).toBe (expected)),
  )
})
