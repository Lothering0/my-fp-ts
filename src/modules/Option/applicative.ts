import { createApplicative, Applicative } from "../../types/Applicative"
import { URI, some } from "./option"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"
import { match, zero } from "./utils"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: some,
  ap: (ff, fa) =>
    match (fa, zero, a =>
      pipe (
        ff,
        match (zero, f => pipe (a, f, some)),
      ),
    ),
})

export const { of, ap, apply, flap, flipApply } = applicative
