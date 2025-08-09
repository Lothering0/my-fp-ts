import * as functor from "../../types/Functor"
import { Result, ResultHkt, fail, succeed } from "./result"
import { createBifunctor } from "../../types/Bifunctor"
import { match } from "./utils"
import { flow } from "../../utils/flow"

export const Functor: functor.Functor<ResultHkt> = {
  map: ab => match (fail, flow (ab, succeed)),
}

export const Bifunctor = createBifunctor<ResultHkt> ({
  ...Functor,
  mapLeft: ed => match (flow (ed, fail), succeed),
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
