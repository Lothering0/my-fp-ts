import * as E from "./either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"

export const functor: Functor2<typeof E._URI> = createFunctor2 ({
  _URI: E._URI,
  map: (fa, f) => E.isLeft (fa) ? fa : pipe (fa, E.fromRight, f, E.right),
})

export const bifunctor: Bifunctor<typeof E._URI> = createBifunctor ({
  ...functor,
  mapLeft: (fe, f) => E.isRight (fe) ? fe : pipe (fe, E.fromLeft, f, E.left),
})

export const { map, mapLeft, bimap } = bifunctor
