import * as alt from "../../types/Alt"
import * as async from "../Async"
import * as result from "../Result"
import { identity } from "../Identity"
import { AsyncResult, AsyncResultHKT, succeed } from "./async-result"
import { match } from "./utils"
import { constant } from "../../utils/constant"

export const getOrElse: {
  <E, B>(
    onFailure: (e: E) => B,
  ): <A>(self: AsyncResult<E, A>) => async.Async<A | B>
} = onFailure => match (onFailure, identity)

export const orElse =
  <E1, A>(onFailure: AsyncResult<E1, A>) =>
  <E2, B>(self: AsyncResult<E2, B>): AsyncResult<E1 | E2, A | B> =>
    async.flatMap (result.match (constant (onFailure), succeed<E1 | E2, A | B>)) (
      self,
    )

export const catchAll =
  <E1, E2, A, B>(onFailure: (e: E1) => AsyncResult<E2, B>) =>
  (self: AsyncResult<E1, A>): AsyncResult<E2, A | B> =>
    async.flatMap (result.match (onFailure, succeed<E2, A | B>)) (self)

export const Alt: alt.Alt<AsyncResultHKT> = {
  orElse,
}
