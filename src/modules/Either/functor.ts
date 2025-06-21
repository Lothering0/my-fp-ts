import { URI, left, right } from "./either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"
import { fromLeft, fromRight, isLeft, isRight } from "./utils"

export const functor: Functor2<URI> = createFunctor2 ({
  URI,
  map: (fa, f) => isLeft (fa) ? fa : pipe (fa, fromRight, f, right),
})

export const bifunctor: Bifunctor<URI> = createBifunctor ({
  ...functor,
  mapLeft: (fe, f) => isRight (fe) ? fe : pipe (fe, fromLeft, f, left),
})

export const { map, mapLeft, bimap } = bifunctor
