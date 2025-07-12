import * as F from "../../types/Functor"
import { IdentityHKT } from "./identity"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<IdentityHKT> = {
  map: overload (1, (self, ab) => ab (self)),
}

export const { map } = Functor
