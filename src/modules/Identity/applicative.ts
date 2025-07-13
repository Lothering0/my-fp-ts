import { overload } from "../../utils/overloads"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { IdentityHKT, identity } from "./identity"

export const Applicative = createApplicative<IdentityHKT> ({
  ...Functor,
  of: identity,
  ap: overload (1, (ab, a) => ab (a)),
})

export const { of, ap, apply, flap, flipApply } = Applicative
