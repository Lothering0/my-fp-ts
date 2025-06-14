import { functor, map } from "./functor"
import { _URI, io, fromIo } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  ...functor,
  of: io,
  apply: (fa, ff) => pipe (fa, map (fromIo (ff))),
})

export const { of, apply, ap } = applicative
