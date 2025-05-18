import { Applicative, createApplicative } from "../../types/Applicative"
import { map } from "./functor"
import { _URI, identity } from "./identity"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  _URI,
  of: identity,
  apply: map,
})

export const { of, apply } = applicative
