import { Applicative, createApplicative } from "../../types/Applicative"
import { map } from "./functor"

export const applicative: Applicative<"Array"> = createApplicative ({
  _URI: "Array",
  of: a => [a],
  apply: (fa, ff) => map (ff, f => map (fa, f)).flat (),
})

export const { of, apply } = applicative
