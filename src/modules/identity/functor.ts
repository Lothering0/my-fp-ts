import { _URI } from "./identity"
import { createFunctor, Functor } from "../../types/Functor"

export const functor: Functor<typeof _URI> = createFunctor ({
  _URI,
  map: (fa, f) => f (fa),
})

export const { map } = functor
