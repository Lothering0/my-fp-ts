import * as Alt_ from "../../types/Alt"
import * as A from "../Async"
import * as R from "../Result"
import { identity } from "../Identity"
import { AsyncResult, AsyncResultHKT, success } from "./async-result"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { overload } from "../../utils/overloads"

export const getOrElse: {
  <E, A, B>(onFailure: (e: E) => B): (self: AsyncResult<E, A>) => A | B
  <E, A, B>(self: AsyncResult<E, A>, onFailure: (e: E) => B): A | B
} = overload (1, (self, onFailure) => match (self, onFailure, identity))

export const orElse: {
  <E1, E2, A>(
    onFailure: AsyncResult<E2, A>,
  ): (self: AsyncResult<E1, A>) => AsyncResult<E2, A>
  <E1, E2, A>(
    self: AsyncResult<E1, A>,
    onFailure: AsyncResult<E2, A>,
  ): AsyncResult<E2, A>
} = overload (1, (self, that) =>
  A.flatMap (self, R.match (constant (that), success)),
)

export const catchAll: {
  <E1, E2, A, B>(
    onFailure: (e: E1) => AsyncResult<E2, B>,
  ): (self: AsyncResult<E1, A>) => AsyncResult<E2, A | B>
  <E1, E2, A, B>(
    self: AsyncResult<E1, A>,
    onFailure: (e: E1) => AsyncResult<E2, B>,
  ): AsyncResult<E2, A | B>
} = overload (1, (self, that) => A.flatMap (self, R.match (that, success)))

export const Alt: Alt_.Alt<AsyncResultHKT> = {
  orElse,
}
