import { PredicateHKT } from "./predicate"
import { Contravariant } from "../../types/Contravariant"
import { compose } from "../Identity"
import { overload } from "../../utils/overloads"

export const contravariant: Contravariant<PredicateHKT> = {
  contramap: overload (1, compose),
}

export const { contramap } = contravariant
