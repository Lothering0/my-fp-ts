import { createApplicative, Applicative } from "../../types/Applicative"
import { URI, none, some } from "./option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { match } from "./utils"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: some,
  ap: (ff, fa) =>
    match (
      fa,
      () => none,
      a =>
        pipe (
          ff,
          match (
            () => none,
            f => pipe (a, f, some),
          ),
        ),
    ),
})

export const { of, ap, apply, flap, flipApply } = applicative
