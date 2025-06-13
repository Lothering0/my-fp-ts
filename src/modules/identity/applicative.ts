import { Applicative, createApplicative } from "../../types/Applicative"
import { functor, map } from "./functor"
import { _URI, identity } from "./identity"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  ...functor,
  of: identity,
  apply: map,
})

export const { of, apply, ap } = applicative
