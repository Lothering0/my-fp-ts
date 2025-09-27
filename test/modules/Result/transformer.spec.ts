import { Number, Array, Result, pipe, String, Equivalence } from '../../../src'

describe('transformer', () => {
  const ArrayOfResult = Result.transform(Array.Monad)

  it('should correctly transform `ReadonlyArray` monad', () => {
    const EquivalenceNumber = Array.getEquivalence(
      Result.getEquivalence(Number.Equivalence, String.Equivalence),
    )
    const EquivalenceString = Array.getEquivalence(
      Result.getEquivalence(String.Equivalence, String.Equivalence),
    )

    pipe(
      1,
      ArrayOfResult.succeed,
      EquivalenceNumber.equals([Result.succeed(1)]),
      expect,
    ).toBe(true)

    pipe(
      'a',
      ArrayOfResult.fail,
      EquivalenceNumber.equals([Result.fail('a')]),
      expect,
    ).toBe(true)

    pipe(
      1,
      ArrayOfResult.of,
      ArrayOfResult.map(Number.show),
      EquivalenceString.equals([Result.succeed('1')]),
      expect,
    ).toBe(true)
  })

  it('should correctly compose multiple monads', () => {
    const ArrayOfResultResult = Result.transform(ArrayOfResult.Monad)
    const EquivalenceNumber = pipe(
      Result.getEquivalence(
        Result.getEquivalence(
          Number.Equivalence,
          Equivalence.EquivalenceStrict,
        ),
        Equivalence.EquivalenceStrict,
      ),
      Array.getEquivalence,
    )
    const EquivalenceString = pipe(
      Result.getEquivalence(
        Result.getEquivalence(
          String.Equivalence,
          Equivalence.EquivalenceStrict,
        ),
        Equivalence.EquivalenceStrict,
      ),
      Array.getEquivalence,
    )

    pipe(
      1,
      ArrayOfResultResult.of,
      EquivalenceNumber.equals([pipe(1, Result.succeed, Result.succeed)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      ArrayOfResultResult.of,
      ArrayOfResultResult.map(String.String),
      EquivalenceString.equals([pipe('1', Result.succeed, Result.succeed)]),
      expect,
    ).toBe(true)
  })
})
