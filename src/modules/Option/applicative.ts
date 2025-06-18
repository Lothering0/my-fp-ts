import { createApplicative, Applicative } from "../../types/Applicative"
import { URI, match, none, some } from "./option"
import { pipe, flow } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: some,
  apply: (fa, ff) =>
    match (
      ff,
      () => none,
      f =>
        pipe (
          fa,
          match (() => none, flow (f, some)),
        ),
    ),
})

export const { of, apply, ap } = applicative
