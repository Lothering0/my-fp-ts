import * as C from "../../types/Contravariant"
import { Predicate, PredicateHKT } from "./predicate"
import { flow } from "src/utils/flow"

export const Contravariant: C.Contravariant<PredicateHKT> = {
  contramap: ba => self => flow (ba, self),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Predicate<A>) => Predicate<B>
} = Contravariant.contramap
