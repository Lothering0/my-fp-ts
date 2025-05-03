import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { map } from "./functor"
import { fromRight, isLeft } from "./either"

export const applicative: Applicative2<"Either"> = createApplicative2 ({
  _URI: "Either",
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
})

export const { apply } = applicative
