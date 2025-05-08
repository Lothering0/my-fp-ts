import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { map } from "./functor"
import { right, fromRight, isLeft } from "./either"

export const applicative: Applicative2<"Either"> = createApplicative2 ({
  _URI: "Either",
  of: right,
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
})

export const { of, apply } = applicative
