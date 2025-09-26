import * as equivalence from '../../typeclasses/Equivalence'

export const Equivalence: equivalence.Equivalence<boolean> =
  equivalence.EquivalenceStrict

export const { equals } = Equivalence
