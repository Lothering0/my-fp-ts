import { option, array, pipe, number, string } from '../../../src'

describe('transformer', () => {
  const arrayOfOptions = option.transform(array.Monad)

  it('should correctly transform `ReadonlyArray` monad', () => {
    const EquivalenceNumber = pipe(
      number.Equivalence,
      option.getEquivalence,
      array.getEquivalence,
    )
    const EquivalenceString = pipe(
      string.Equivalence,
      option.getEquivalence,
      array.getEquivalence,
    )

    pipe(
      1,
      arrayOfOptions.of,
      EquivalenceNumber.equals([option.some(1)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      arrayOfOptions.of,
      arrayOfOptions.map(String),
      EquivalenceString.equals([option.some('1')]),
      expect,
    ).toBe(true)
  })

  it('should correctly compose multiple monads', () => {
    const arrayOfOptionOption = option.transform(arrayOfOptions.Monad)
    const EquivalenceNumber = pipe(
      number.Equivalence,
      option.getEquivalence,
      option.getEquivalence,
      array.getEquivalence,
    )
    const EquivalenceString = pipe(
      string.Equivalence,
      option.getEquivalence,
      option.getEquivalence,
      array.getEquivalence,
    )

    pipe(
      1,
      arrayOfOptionOption.of,
      EquivalenceNumber.equals([pipe(1, option.some, option.some)]),
      expect,
    ).toBe(true)

    pipe(
      1,
      arrayOfOptionOption.of,
      arrayOfOptionOption.map(String),
      EquivalenceString.equals([pipe('1', option.some, option.some)]),
      expect,
    ).toBe(true)
  })
})
