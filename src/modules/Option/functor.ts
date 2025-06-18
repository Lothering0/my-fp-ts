import { createFunctor, Functor } from "../../types/Functor"
import { URI, some, none, match } from "./option"
import { pipe, flow } from "../../utils/flow"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) =>
    pipe (
      fa,
      match (() => none, flow (f, some)),
    ),
})

export const { map } = functor
