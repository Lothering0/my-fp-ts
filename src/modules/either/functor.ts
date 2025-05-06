import { Functor2, createFunctor2 } from "../../types/Functor"
import { isLeft, fromRight, right } from "./either"
import { pipe } from "../../utils/pipe"

export const functor: Functor2<"Either"> = createFunctor2 ({
  _URI: "Either",
  of: right,
  map: (fa, f) => isLeft (fa) ? fa : pipe (fa, fromRight, f, right),
})

export const { of, map } = functor
