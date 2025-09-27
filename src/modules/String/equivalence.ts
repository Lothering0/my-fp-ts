import * as Equivalence_ from '../../typeclasses/Equivalence'

export const Equivalence: Equivalence_.Equivalence<string> =
  Equivalence_.EquivalenceStrict

export const { equals } = Equivalence
