import * as F from "../../types/Functor"
import { Result, ResultHKT, failure, success } from "./result"
import { createBifunctor } from "../../types/Bifunctor"
import { match } from "./utils"
import { flow } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<ResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: Result<_, A>, ab: (a: A) => B): Result<_, B> =>
      match (self, failure<_, B>, flow (ab, success)),
  ),
}

export const Bifunctor = createBifunctor<ResultHKT> ({
  ...Functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: Result<E, _>, ed: (e: E) => D): Result<D, _> =>
      match (self, flow (ed, failure), success<D, _>),
  ),
})

export const map: {
  <_, A, B>(ab: (a: A) => B): (self: Result<_, A>) => Result<_, B>
  <_, A, B>(self: Result<_, A>, ab: (a: A) => B): Result<_, B>
} = Functor.map

export const mapLeft: {
  <E, _, D>(ed: (e: E) => D): (self: Result<E, _>) => Result<D, _>
  <E, _, D>(self: Result<E, _>, ed: (e: E) => D): Result<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: Result<E, A>) => Result<D, B>
  <E, A, D, B>(
    self: Result<E, A>,
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): Result<D, B>
} = Bifunctor.bimap
