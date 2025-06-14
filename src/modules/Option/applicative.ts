import { createApplicative, Applicative } from "../../types/Applicative"
import { _URI, match, none, some } from "./option"
import { pipe, flow } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative<typeof _URI> = createApplicative ({
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
