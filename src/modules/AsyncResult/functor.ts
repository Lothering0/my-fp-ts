import * as result from "../Result"
import * as functor from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { AsyncResultHKT, toPromise, AsyncResult } from "./async-result"

export const Functor: functor.Functor<AsyncResultHKT> = {
  map: ab => self => () => toPromise (self).then (result.map (ab)),
}

export const Bifunctor = createBifunctor<AsyncResultHKT> ({
  ...Functor,
  mapLeft: ed => self => () => toPromise (self).then (result.mapLeft (ed)),
})

export const map: {
  <A, B>(ab: (a: A) => B): <_>(self: AsyncResult<_, A>) => AsyncResult<_, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <_>(self: AsyncResult<E, _>) => AsyncResult<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: AsyncResult<E, A>) => AsyncResult<D, B>
} = Bifunctor.bimap
