import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import * as string from "../../../src/modules/String"

interface TestCase {
  readonly description: string
  readonly result1: result.Result<string, number>
  readonly result2: result.Result<string, number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = result.getEq (string.Eq, number.Eq)

  const testCases: TestCase[] = [
    {
      description: "should return `false` for different `failure`s",
      result1: result.failure ("a"),
      result2: result.failure ("b"),
      expected: false,
    },
    {
      description: "should return `true` for same `failure`s",
      result1: result.failure ("a"),
      result2: result.failure ("a"),
      expected: true,
    },
    {
      description:
        "should return `false` if first is `failure` and second is `success`",
      result1: result.failure ("a"),
      result2: result.success (1),
      expected: false,
    },
    {
      description: "should return `false` for different `success`es",
      result1: result.success (0),
      result2: result.success (1),
      expected: false,
    },
    {
      description: "should return `true` for same `success`es",
      result1: result.success (1),
      result2: result.success (1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, result1, result2, expected }) =>
    it (description, () => expect (Eq.equals (result1) (result2)).toBe (expected)),
  )
})
