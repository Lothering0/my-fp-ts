import { createApplicative, Applicative } from "../../types/Applicative"
import { option, none, some } from "./option"
import { compose } from "../identity"

export const applicative: Applicative<"Option"> = createApplicative ({
  _URI: "Option",
  of: some,
  apply: (fa, ff) =>
    option (
      ff,
      () => none,
      f => option (fa, () => none, compose (some, f)),
    ),
})

export const { of, apply } = applicative
