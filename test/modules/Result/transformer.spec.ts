import { number, array, result, pipe, string, equivalence } from '../../../src'

describe('transformer', () => {
  const arrayResult = result.transform(array.Monad)

  it('should correctly transform `ReadonlyArray` monad', () => {
    const EquivalenceNumber = array.getEquivalence(
      result.getEquivalence(string.Equivalence, number.Equivalence),
    )
    const EquivalenceString = array.getEquivalence(
      result.getEquivalence(string.Equivalence, string.Equivalence),
    )

    pipe(
      1,
      arrayResult.succeed,
      EquivalenceNumber.equals([result.succeed(1)]),
      expect,
    ).toBe(true)

    pipe(
      'a',
      arrayResult.fail,
      EquivalenceNumber.equals([result.fail('a')]),
      expect,
    ).toBe(true)

    pipe(
      1,
      arrayResult.of,
      arrayResult.map(number.show),
      EquivalenceString.equals([result.succeed('1')]),
      expect,
    ).toBe(true)
  })

  it('should correctly compose multiple monads', () => {
    const arrayResultResult = result.transform(arrayResult.Monad)
    const EquivalenceNumber = pipe(
      result.getEquivalence(
        equivalence.EquivalenceStrict,
        result.getEquivalence(
          equivalence.EquivalenceStrict,
          number.Equivalence,
        ),
      ),
      array.getEquivalence,
    )
    const EquivalenceString = pipe(
      result.getEquivalence(
        equivalence.EquivalenceStrict,
        result.getEquivalence(
          equivalence.EquivalenceStrict,
          string.Equivalence,
        ),
      ),
      array.getEquivalence,
    )

    pipe(
      1,
      arrayResultResult.of,
      EquivalenceNumber.equals([pipe(1, result.succeed, result.succeed)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      arrayResultResult.of,
      arrayResultResult.map(String),
      EquivalenceString.equals([pipe('1', result.succeed, result.succeed)]),
      expect,
    ).toBe(true)
  })
})
