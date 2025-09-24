import * as functor from "../../typeclasses/Functor"
import { Result, ResultHkt, fail, succeed } from "./result"
import { create } from "../../typeclasses/Bifunctor"
import { match } from "./matchers"
import { flow } from "../../utils/flow"

export const Functor: functor.Functor<ResultHkt> = {
  map: ab =>
    match ({
      onFailure: fail,
      onSuccess: flow (ab, succeed),
    }),
}

export const Bifunctor = create<ResultHkt> (Functor, {
  mapLeft: ed =>
    match ({
      onFailure: flow (ed, fail),
      onSuccess: succeed,
    }),
})

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: Result<E, A>) => Result<E, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <A>(self: Result<E, A>) => Result<D, A>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: Result<E, A>) => Result<D, B>
} = Bifunctor.bimap
