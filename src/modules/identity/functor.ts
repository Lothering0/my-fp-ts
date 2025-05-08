import { createFunctor, Functor } from "../../types/Functor"

export const functor: Functor<"Identity"> = createFunctor ({
  _URI: "Identity",
  map: (fa, f) => f (fa),
})

export const { map } = functor
