import * as R from "../Result"
import * as F from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { AsyncResultHKT, toPromise, AsyncResult } from "./async-result"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<AsyncResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: AsyncResult<_, A>, ab: (a: A) => B): AsyncResult<_, B> =>
      () =>
        toPromise (self).then (R.map (ab)),
  ),
}

export const Bifunctor = createBifunctor<AsyncResultHKT> ({
  ...Functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: AsyncResult<E, _>, ed: (e: E) => D): AsyncResult<D, _> =>
      () =>
        toPromise (self).then (R.mapLeft (ed)),
  ),
})

export const { map, mapLeft, bimap } = Bifunctor
