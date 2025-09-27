import { Number, Result, String } from '../../../src'

interface TestCase {
  readonly description: string
  readonly result1: Result.Result<string, number>
  readonly result2: Result.Result<string, number>
  readonly expected: boolean
}

describe('getEquivalence', () => {
  const Equivalence = Result.getEquivalence(
    String.Equivalence,
    Number.Equivalence,
  )

  const testCases: TestCase[] = [
    {
      description: 'should return `false` for different `failure`s',
      result1: Result.fail('a'),
      result2: Result.fail('b'),
      expected: false,
    },
    {
      description: 'should return `true` for same `failure`s',
      result1: Result.fail('a'),
      result2: Result.fail('a'),
      expected: true,
    },
    {
      description:
        'should return `false` if first is `failure` and second is `success`',
      result1: Result.fail('a'),
      result2: Result.succeed(1),
      expected: false,
    },
    {
      description: 'should return `false` for different `success`es',
      result1: Result.succeed(0),
      result2: Result.succeed(1),
      expected: false,
    },
    {
      description: 'should return `true` for same `success`es',
      result1: Result.succeed(1),
      result2: Result.succeed(1),
      expected: true,
    },
  ]

  testCases.forEach(({ description, result1, result2, expected }) =>
    it(description, () =>
      expect(Equivalence.equals(result1)(result2)).toBe(expected),
    ),
  )
})
