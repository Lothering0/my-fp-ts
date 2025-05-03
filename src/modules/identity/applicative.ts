import { Applicative, createApplicative } from "../../types/Applicative"
import { map } from "./functor"

export const applicative: Applicative<"Identity"> = createApplicative ({
  _URI: "Identity",
  apply: map,
})

export const { apply } = applicative
