import { Applicative, createApplicative } from "../../types/Applicative"
import { map } from "./functor"
import { identity } from "./identity"

export const applicative: Applicative<"Identity"> = createApplicative ({
  _URI: "Identity",
  of: identity,
  apply: map,
})

export const { of, apply } = applicative
