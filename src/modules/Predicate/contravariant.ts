import * as C from "../../types/Contravariant"
import { Predicate, PredicateHKT } from "./predicate"
import { compose } from "../Identity"
import { overload } from "../../utils/overloads"

export const Contravariant: C.Contravariant<PredicateHKT> = {
  contramap: overload (1, compose),
}

export const contramap: {
  <A, B>(ba: (b: B) => A): (self: Predicate<A>) => Predicate<B>
  <A, B>(self: Predicate<A>, ba: (b: B) => A): Predicate<B>
} = Contravariant.contramap
