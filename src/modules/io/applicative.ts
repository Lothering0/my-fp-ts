import { map } from "./functor"
import { io, fromIo } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"

export const applicative: Applicative<"IO"> = createApplicative ({
  _URI: "IO",
  of: io,
  apply: (fa, ff) => map (fa, fromIo (ff)),
})

export const { of, apply } = applicative
