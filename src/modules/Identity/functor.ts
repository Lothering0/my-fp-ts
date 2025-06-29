import { IdentityHKT } from "./identity"
import { Functor } from "../../types/Functor"
import { overload } from "../../utils/overloads"

export const functor: Functor<IdentityHKT> = {
  map: overload (1, (self, ab) => ab (self)),
}

export const { map } = functor
