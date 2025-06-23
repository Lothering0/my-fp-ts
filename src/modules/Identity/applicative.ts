import { Applicative, createApplicative } from "../../types/Applicative"
import { functor } from "./functor"
import { URI, identity } from "./identity"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: identity,
  ap: (f, a) => f (a),
})

export const { of, ap, apply, flap, flipApply } = applicative
