import * as E from "./either"
import { Functor2, createFunctor2 } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { pipe } from "../../utils/flow"

export const functor: Functor2<"Either"> = createFunctor2 ({
  _URI: "Either",
  map: (fa, f) => E.isLeft (fa) ? fa : pipe (fa, E.fromRight, f, E.right),
})

export const bifunctor: Bifunctor<"Either"> = createBifunctor ({
  ...functor,
  mapLeft: (fe, f) => E.isRight (fe) ? fe : pipe (fe, E.fromLeft, f, E.left),
})

export const { map, mapLeft, bimap } = bifunctor
