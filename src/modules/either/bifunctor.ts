import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { Either, isRight, isLeft, fromLeft, left } from "./either"
import { map } from "./functor"
import { pipe } from "../../utils/pipe"

export const bifunctor: Bifunctor<"Either"> = createBifunctor ({
  _URI: "Either",
  mapLeft: (fa, f) => isRight (fa) ? fa : pipe (fa, fromLeft, f, left),
  bimap: <E, A, B = E, C = A>(
    fa: Either<E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ) => isLeft (fa) ? mapLeft<E, C, B> (fa, f) : map<B, A, C> (fa, g),
})

export const { mapLeft, bimap } = bifunctor
