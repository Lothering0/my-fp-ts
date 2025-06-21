import { createFunctor, Functor } from "../../types/Functor"
import { URI, some, none } from "./option"
import { pipe, flow } from "../../utils/flow"
import { match } from "./utils"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) =>
    pipe (
      fa,
      match (() => none, flow (f, some)),
    ),
})

export const { map } = functor
