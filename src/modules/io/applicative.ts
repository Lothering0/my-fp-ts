import { map } from "./functor"
import { fromIo } from "./io"
import { Applicative, createApplicative } from "../../types/Applicative"

export const applicative: Applicative<"IO"> = createApplicative ({
  _URI: "IO",
  apply: (fa, ff) => map (fa, fromIo (ff)),
})

export const { apply } = applicative
