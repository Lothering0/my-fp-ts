import { _URI, Separated, left, right } from "./separated"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"

export const functor: Functor2<typeof _URI> = createFunctor2 ({
  _URI,
  map: <_, A, B>(fa: Separated<_, A>, f: (a: A) => B) => ({
    left: left (fa),
    right: pipe (fa, right, f),
  }),
})

export const bifunctor: Bifunctor<typeof _URI> = createBifunctor ({
  ...functor,
  mapLeft: <E, _, D>(fe: Separated<E, _>, f: (e: E) => D) => ({
    left: pipe (fe, left, f),
    right: right (fe),
  }),
})

export const { map, mapLeft, bimap } = bifunctor
