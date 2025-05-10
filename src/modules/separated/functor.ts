import { Separated, left, right } from "./separated"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"

export const functor: Functor2<"Separated"> = createFunctor2 ({
  _URI: "Separated",
  map: <_, A, B>(fa: Separated<_, A>, f: (a: A) => B) => ({
    left: left (fa),
    right: pipe (fa, right, f),
  }),
})

export const bifunctor: Bifunctor<"Separated"> = createBifunctor ({
  ...functor,
  mapLeft: <E, _, D>(fe: Separated<E, _>, f: (e: E) => D) => ({
    left: pipe (fe, left, f),
    right: right (fe),
  }),
})

export const { map, mapLeft, bimap } = bifunctor
