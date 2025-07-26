import * as Alt_ from "../../types/Alt"
import * as A from "../Async"
import * as R from "../Result"
import { identity } from "../Identity"
import { AsyncResult, AsyncResultHKT, success } from "./async-result"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse =
  <E, B>(onFailure: (e: E) => B) =>
  <A>(self: AsyncResult<E, A>): A.Async<A | B> =>
    match (onFailure, identity<A | B>) (self)

export const orElse =
  <E1, A>(onFailure: AsyncResult<E1, A>) =>
  <E2, B>(self: AsyncResult<E2, B>): AsyncResult<E1 | E2, A | B> =>
    A.flatMap (R.match (constant (onFailure), success<E1 | E2, A | B>)) (self)

export const catchAll =
  <E1, E2, A, B>(onFailure: (e: E1) => AsyncResult<E2, B>) =>
  (self: AsyncResult<E1, A>): AsyncResult<E2, A | B> =>
    A.flatMap (R.match (onFailure, success<E2, A | B>)) (self)

export const Alt: Alt_.Alt<AsyncResultHKT> = {
  orElse,
}
