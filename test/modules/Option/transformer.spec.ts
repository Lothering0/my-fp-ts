import { Option, Array, pipe, Number, String } from '../../../src'

describe('transformer', () => {
  const ArrayOfOptions = Option.transform(Array.Monad)

  it('should correctly transform `ReadonlyArray` monad', () => {
    const EquivalenceNumber = pipe(
      Number.Equivalence,
      Option.getEquivalence,
      Array.getEquivalence,
    )
    const EquivalenceString = pipe(
      String.Equivalence,
      Option.getEquivalence,
      Array.getEquivalence,
    )

    pipe(
      1,
      ArrayOfOptions.of,
      EquivalenceNumber.equals([Option.some(1)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      ArrayOfOptions.of,
      ArrayOfOptions.map(String.String),
      EquivalenceString.equals([Option.some('1')]),
      expect,
    ).toBe(true)
  })

  it('should correctly compose multiple monads', () => {
    const ArrayOfOptionOption = Option.transform(ArrayOfOptions.Monad)
    const EquivalenceNumber = pipe(
      Number.Equivalence,
      Option.getEquivalence,
      Option.getEquivalence,
      Array.getEquivalence,
    )
    const EquivalenceString = pipe(
      String.Equivalence,
      Option.getEquivalence,
      Option.getEquivalence,
      Array.getEquivalence,
    )

    pipe(
      1,
      ArrayOfOptionOption.of,
      EquivalenceNumber.equals([pipe(1, Option.some, Option.some)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      ArrayOfOptionOption.of,
      ArrayOfOptionOption.map(String.String),
      EquivalenceString.equals([pipe('1', Option.some, Option.some)]),
      expect,
    ).toBe(true)
  })
})
