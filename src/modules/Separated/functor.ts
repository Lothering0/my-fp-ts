import { URI, Separated, left, right } from "./separated"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"
import { make } from "./utils"

export const functor: Functor2<URI> = createFunctor2 ({
  URI,
  map: <_, A, B>(fa: Separated<_, A>, f: (a: A) => B) =>
    make (left (fa), pipe (fa, right, f)),
})

export const bifunctor: Bifunctor<URI> = createBifunctor ({
  ...functor,
  mapLeft: <E, _, D>(fe: Separated<E, _>, f: (e: E) => D) =>
    make (pipe (fe, left, f), right (fe)),
})

export const { map, mapLeft, bimap } = bifunctor
