import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import * as string from "../../../src/modules/String"

interface TestCase {
  readonly description: string
  readonly result1: result.Result<string, number>
  readonly result2: result.Result<string, number>
  readonly expected: boolean
}

describe ("getEquivalence", () => {
  const Equivalence = result.getEquivalence (
    string.Equivalence,
    number.Equivalence,
  )

  const testCases: TestCase[] = [
    {
      description: "should return `false` for different `failure`s",
      result1: result.fail ("a"),
      result2: result.fail ("b"),
      expected: false,
    },
    {
      description: "should return `true` for same `failure`s",
      result1: result.fail ("a"),
      result2: result.fail ("a"),
      expected: true,
    },
    {
      description:
        "should return `false` if first is `failure` and second is `success`",
      result1: result.fail ("a"),
      result2: result.succeed (1),
      expected: false,
    },
    {
      description: "should return `false` for different `success`es",
      result1: result.succeed (0),
      result2: result.succeed (1),
      expected: false,
    },
    {
      description: "should return `true` for same `success`es",
      result1: result.succeed (1),
      result2: result.succeed (1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, result1, result2, expected }) =>
    it (description, () =>
      expect (Equivalence.equals (result1) (result2)).toBe (expected),
    ),
  )
})
