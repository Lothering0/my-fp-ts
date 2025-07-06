import { Result, ResultHKT, failure, success } from "./result"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { fromFailure, fromSuccess, isFailure, isSuccess } from "./utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<ResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: Result<_, A>, ab: (a: A) => B): Result<_, B> =>
      isFailure (self) ? self : pipe (self, fromSuccess, ab, success),
  ),
}

export const bifunctor: Bifunctor<ResultHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: Result<E, _>, ed: (e: E) => D): Result<D, _> =>
      isSuccess (self) ? self : pipe (self, fromFailure, ed, failure),
  ),
})

export const { map, mapLeft, bimap } = bifunctor
