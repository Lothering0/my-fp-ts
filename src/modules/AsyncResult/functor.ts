import * as result from "../Result"
import * as functor from "../../typeclasses/Functor"
import { createBifunctor } from "../../typeclasses/Bifunctor"
import { AsyncResultHkt, toPromise, AsyncResult } from "./async-result"

export const Functor: functor.Functor<AsyncResultHkt> = {
  map: ab => self => () => toPromise (self).then (result.map (ab)),
}

export const Bifunctor = createBifunctor<AsyncResultHkt> ({
  ...Functor,
  mapLeft: ed => self => () => toPromise (self).then (result.mapLeft (ed)),
})

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: AsyncResult<E, A>) => AsyncResult<E, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <A>(self: AsyncResult<E, A>) => AsyncResult<D, A>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: AsyncResult<E, A>) => AsyncResult<D, B>
} = Bifunctor.bimap
