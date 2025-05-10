import { createApplicative, Applicative } from "../../types/Applicative"
import { option, none, some } from "./option"
import { pipe, flow } from "../../utils/flow"

export const applicative: Applicative<"Option"> = createApplicative ({
  _URI: "Option",
  of: some,
  apply: (fa, ff) =>
    option (
      ff,
      () => none,
      f =>
        pipe (
          fa,
          option (() => none, flow (f, some)),
        ),
    ),
})

export const { of, apply } = applicative
