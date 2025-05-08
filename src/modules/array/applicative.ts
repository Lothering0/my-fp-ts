import { Applicative, createApplicative } from "../../types/Applicative"
import { map } from "./functor"
import { flat } from "./monad"

export const applicative: Applicative<"Array"> = createApplicative ({
  _URI: "Array",
  of: a => [a],
  apply: (fa, ff) => flat (map (ff, f => map (fa, f))),
})

export const { of, apply } = applicative
