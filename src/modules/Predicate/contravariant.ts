import * as contravariant from "../../types/Contravariant"
import { Predicate, PredicateHkt } from "./predicate"
import { flow } from "../../utils/flow"

export const Contravariant: contravariant.Contravariant<PredicateHkt> = {
  contramap: ba => self => flow (ba, self),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Predicate<A>) => Predicate<B>
} = Contravariant.contramap
