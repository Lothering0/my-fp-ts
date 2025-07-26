import * as R from "../../../src/modules/Result"
import * as N from "../../../src/modules/Number"
import * as S from "../../../src/modules/String"

interface TestCase {
  readonly description: string
  readonly result1: R.Result<string, number>
  readonly result2: R.Result<string, number>
  readonly expected: boolean
}

describe ("getEq", () => {
  const Eq = R.getEq (S.Eq, N.Eq)

  const testCases: TestCase[] = [
    {
      description: "should return `false` for different `failure`s",
      result1: R.failure ("a"),
      result2: R.failure ("b"),
      expected: false,
    },
    {
      description: "should return `true` for same `failure`s",
      result1: R.failure ("a"),
      result2: R.failure ("a"),
      expected: true,
    },
    {
      description:
        "should return `false` if first is `failure` and second is `success`",
      result1: R.failure ("a"),
      result2: R.success (1),
      expected: false,
    },
    {
      description: "should return `false` for different `success`es",
      result1: R.success (0),
      result2: R.success (1),
      expected: false,
    },
    {
      description: "should return `true` for same `success`es",
      result1: R.success (1),
      result2: R.success (1),
      expected: true,
    },
  ]

  testCases.forEach (({ description, result1, result2, expected }) =>
    it (description, () => expect (Eq.equals (result1) (result2)).toBe (expected)),
  )
})
