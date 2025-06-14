import { createFunctor, Functor } from "../../types/Functor"
import { _URI, some, none, match } from "./option"
import { pipe, flow } from "../../utils/flow"

export const functor: Functor<typeof _URI> = createFunctor ({
  _URI,
  map: (fa, f) =>
    pipe (
      fa,
      match (() => none, flow (f, some)),
    ),
})

export const { map } = functor
