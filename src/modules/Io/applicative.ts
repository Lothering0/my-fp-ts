import { functor, map } from "./functor"
import { URI, io, fromIo } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"

export const applicative: Applicative<URI> = createApplicative ({
  ...functor,
  of: io,
  ap: (ff, fa) => pipe (fa, map (fromIo (ff))),
})

export const { of, ap, apply, flap, flipApply } = applicative
