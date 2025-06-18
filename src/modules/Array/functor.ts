import { URI } from "./array"
import { Functor, createFunctor } from "../../types/Functor"
import {
  FunctorWithIndex,
  createFunctorWithIndex,
} from "../../types/FunctorWithIndex"

export const functor: Functor<URI> = createFunctor ({
  URI,
  map: (fa, f) => fa.map (a => f (a)),
})

export const functorWithIndex: FunctorWithIndex<URI, number> =
  createFunctorWithIndex ({
    ...functor,
    mapWithIndex: (fa, f) => fa.map ((a, i) => f (i, a)),
  })

export const { map, mapWithIndex } = functorWithIndex
