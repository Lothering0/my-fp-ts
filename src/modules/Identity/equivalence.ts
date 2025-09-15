import { Equivalence } from "../../typeclasses/Equivalence"
import { Identity, identity } from "./identity"

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<Identity<A>>
} = identity
