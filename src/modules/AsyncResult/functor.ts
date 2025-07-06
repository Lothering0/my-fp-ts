import * as R from "../Result"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { AsyncResultHKT, fromAsyncResult, AsyncResult } from "./async-result"
import { overload } from "../../utils/overloads"

export const functor: Functor<AsyncResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: AsyncResult<_, A>, ab: (a: A) => B): AsyncResult<_, B> =>
      () =>
        fromAsyncResult (self).then (R.map (ab)),
  ),
}

export const bifunctor: Bifunctor<AsyncResultHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: AsyncResult<E, _>, ed: (e: E) => D): AsyncResult<D, _> =>
      () =>
        fromAsyncResult (self).then (R.mapLeft (ed)),
  ),
})

export const { map, mapLeft, bimap } = bifunctor
