import * as R from "../Result"
import { Async } from "../Async"
import { overload } from "../../utils/overloads"
import { fromAsyncResult, AsyncResult } from "./async-result"

export const toUnion: {
  <E, A>(self: AsyncResult<E, A>): Async<E | A>
} = self => () => fromAsyncResult (self).then (R.toUnion)

export const match: {
  <E, A, B>(
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): (self: AsyncResult<E, A>) => Async<B>
  <E, A, B>(
    self: AsyncResult<E, A>,
    onFailure: (e: E) => B,
    onSuccess: (a: A) => B,
  ): Async<B>
} = overload (
  2,
  (self, onFailure, onSuccess) => () =>
    fromAsyncResult (self).then (R.match (onFailure, onSuccess)),
)
