import * as separated from "../../../src/modules/Separated"
import * as number from "../../../src/modules/Number"
import * as string from "../../../src/modules/String"

interface TestCase {
  readonly description: string
  readonly separated1: separated.Separated<string, number>
  readonly separated2: separated.Separated<string, number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = separated.getEq (string.Eq, number.Eq)

  const testCases: TestCase[] = [
    {
      description: "should return `false` for different `left`s and `right`s",
      separated1: separated.make ("a", 0),
      separated2: separated.make ("b", 1),
      expected: false,
    },
    {
      description:
        "should return `false` for same `left`s but different `right`s",
      separated1: separated.make ("a", 0),
      separated2: separated.make ("a", 1),
      expected: false,
    },
    {
      description:
        "should return `false` for same `rights`s but different `left`s",
      separated1: separated.make ("a", 1),
      separated2: separated.make ("b", 1),
      expected: false,
    },
    {
      description: "should return `true` for same `left`s and `right`s",
      separated1: separated.make ("a", 1),
      separated2: separated.make ("a", 1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, separated1, separated2, expected }) =>
    it (description, () =>
      expect (Eq.equals (separated1) (separated2)).toBe (expected),
    ),
  )
})
