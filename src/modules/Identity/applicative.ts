import { Applicative, createApplicative } from "../../types/Applicative"
import { functor, map } from "./functor"
import { URI, identity } from "./identity"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: identity,
  apply: map,
})

export const { of, apply, ap } = applicative
