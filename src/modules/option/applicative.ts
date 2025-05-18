import { createApplicative, Applicative } from "../../types/Applicative"
import { _URI, option, none, some } from "./option"
import { pipe, flow } from "../../utils/flow"

export const applicative: Applicative<typeof _URI> = createApplicative ({
  _URI,
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
