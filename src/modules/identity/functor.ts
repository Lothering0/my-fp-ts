import { identity } from "./identity"
import { createFunctor, Functor } from "../../types/Functor"

export const functor: Functor<"Identity"> = createFunctor ({
  _URI: "Identity",
  pure: identity,
  map: (fa, f) => f (fa),
})

export const { pure, map } = functor
