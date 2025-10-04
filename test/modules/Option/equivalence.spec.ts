import { Number, Option } from '../../../src'

interface TestCase {
  readonly description: string
  readonly option1: Option.Option<number>
  readonly option2: Option.Option<number>
  readonly expected: boolean
}

describe('getEquivalence', () => {
  const Equivalence = Option.getEquivalence(Number.Equivalence)

  const testCases: TestCase[] = [
    {
      description: 'should return `true` for nones',
      option1: Option.none(),
      option2: Option.none(),
      expected: true,
    },
    {
      description:
        'should return `false` if first is `none` and second is `some`',
      option1: Option.some(1),
      option2: Option.none(),
      expected: false,
    },
    {
      description: 'should return `false` for `some`s with different values',
      option1: Option.some(0),
      option2: Option.some(1),
      expected: false,
    },
    {
      description: 'should return `true` for `some`s with same values',
      option1: Option.some(1),
      option2: Option.some(1),
      expected: true,
    },
  ]

  testCases.forEach(({ description, option1, option2, expected }) =>
    it(description, () =>
      expect(Equivalence.equals(option1)(option2)).toBe(expected),
    ),
  )
})
