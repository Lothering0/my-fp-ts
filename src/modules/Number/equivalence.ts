import * as equivalence from '../../typeclasses/Equivalence'

export const Equivalence: equivalence.Equivalence<number> =
  equivalence.EquivalenceStrict

export const { equals } = Equivalence
