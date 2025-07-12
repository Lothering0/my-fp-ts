import * as C from "../../types/Contravariant"
import { PredicateHKT } from "./predicate"
import { compose } from "../Identity"
import { overload } from "../../utils/overloads"

export const Contravariant: C.Contravariant<PredicateHKT> = {
  contramap: overload (1, compose),
}

export const { contramap } = Contravariant
