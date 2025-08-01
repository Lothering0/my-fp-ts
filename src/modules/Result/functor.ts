import * as functor from "../../types/Functor"
import { Result, ResultHKT, fail, succeed } from "./result"
import { createBifunctor } from "../../types/Bifunctor"
import { match } from "./utils"
import { flow } from "../../utils/flow"

export const Functor: functor.Functor<ResultHKT> = {
  map:
    <A, B>(ab: (a: A) => B) =>
    <_>(self: Result<_, A>) =>
      match (fail<_, B>, flow (ab, succeed)) (self),
}

export const Bifunctor = createBifunctor<ResultHKT> ({
  ...Functor,
  mapLeft:
    <E, D>(ed: (e: E) => D) =>
    <_>(self: Result<E, _>) =>
      match (flow (ed, fail), succeed<D, _>) (self),
})

export const map: {
  <A, B>(ab: (a: A) => B): <_>(self: Result<_, A>) => Result<_, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <_>(self: Result<E, _>) => Result<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: Result<E, A>) => Result<D, B>
} = Bifunctor.bimap
