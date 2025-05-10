import { createFunctor, Functor } from "../../types/Functor"
import { some, option, none } from "./option"
import { pipe, flow } from "../../utils/flow"

export const functor: Functor<"Option"> = createFunctor ({
  _URI: "Option",
  map: (fa, f) =>
    pipe (
      fa,
      option (() => none, flow (f, some)),
    ),
})

export const { map } = functor
