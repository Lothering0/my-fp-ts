import * as equivalence from "../../typeclasses/Equivalence"

export const Equivalence: equivalence.Equivalence<string> =
  equivalence.EquivalenceStrict

export const { equals } = Equivalence
