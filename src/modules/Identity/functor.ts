import { URI } from "./identity"
import { createFunctor, Functor } from "../../types/Functor"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) => f (fa),
})

export const { map } = functor
