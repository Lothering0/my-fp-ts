import { map } from "./functor"
import { io, fromIo } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"
import { pipe } from "../../utils/flow"

export const applicative: Applicative<"IO"> = createApplicative ({
  _URI: "IO",
  of: io,
  apply: (fa, ff) => pipe (fa, map (fromIo (ff))),
})

export const { of, apply } = applicative
