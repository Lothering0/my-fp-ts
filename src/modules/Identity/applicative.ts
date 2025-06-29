import { overload } from "src/utils/overloads"
import { Applicative, createApplicative } from "../../types/Applicative"
import { functor } from "./functor"
import { IdentityHKT, identity } from "./identity"

export const applicative: Applicative<IdentityHKT> = createApplicative ({
  ...functor,
  of: identity,
  ap: overload (1, (ab, a) => ab (a)),
})

export const { of, ap, apply, flap, flipApply } = applicative
