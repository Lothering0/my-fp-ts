import * as F from "../../types/Functor"
import { Result, ResultHKT, failure, success } from "./result"
import { createBifunctor } from "../../types/Bifunctor"
import { match } from "./utils"
import { flow } from "../../utils/flow"

export const Functor: F.Functor<ResultHKT> = {
  map:
    <A, B>(ab: (a: A) => B) =>
    <_>(self: Result<_, A>) =>
      match (failure<_, B>, flow (ab, success)) (self),
}

export const Bifunctor = createBifunctor<ResultHKT> ({
  ...Functor,
  mapLeft:
    <E, D>(ed: (e: E) => D) =>
    <_>(self: Result<E, _>) =>
      match (flow (ed, failure), success<D, _>) (self),
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
