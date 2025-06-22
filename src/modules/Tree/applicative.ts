import { URI } from "./tree"
import { Applicative, createApplicative } from "../../types/Applicative"
import { functor, map } from "./functor"
import { pipe } from "../../utils/flow"
import { make, valueOf } from "./utils"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: make,
  apply: (fa, ff) =>
    pipe (
      fa,
      map (a => map (ff, f => f (a))),
      valueOf,
    ),
})

export const { of, apply, ap } = applicative
