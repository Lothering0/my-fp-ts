import { Either, EitherHKT, left, right } from "./either"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { fromLeft, fromRight, isLeft, isRight } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<EitherHKT> = {
  map: overload (
    1,
    <_, A, B>(self: Either<_, A>, ab: (a: A) => B): Either<_, B> =>
      isLeft (self) ? self : pipe (self, fromRight, ab, right),
  ),
}

export const bifunctor: Bifunctor<EitherHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: Either<E, _>, ed: (e: E) => D): Either<D, _> =>
      isRight (self) ? self : pipe (self, fromLeft, ed, left),
  ),
})

export const { map, mapLeft, bimap } = bifunctor
