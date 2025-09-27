import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import * as Result from '../Result'
import { identity } from '../Identity'
import { AsyncResult, AsyncResultHkt, succeed } from './async-result'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const getOrElse: {
  <B, E>(
    onFailure: (failure: E) => B,
  ): <A>(self: AsyncResult<A, E>) => Async.Async<A | B>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse =
  <B, E1>(onFailure: AsyncResult<B, E1>) =>
  <A, E2>(self: AsyncResult<A, E2>): AsyncResult<A | B, E1 | E2> =>
    pipe(
      self,
      Async.flatMap(
        Result.match({
          onFailure: constant(onFailure),
          onSuccess: succeed<A & B>,
        }),
      ),
    )

export const catchAll =
  <A, B, E1, E2>(onFailure: (failure: E1) => AsyncResult<B, E2>) =>
  (self: AsyncResult<A, E1>): AsyncResult<A | B, E2> =>
    pipe(
      self,
      Async.flatMap(
        Result.match({
          onFailure,
          onSuccess: succeed<A & B>,
        }),
      ),
    )

export const Alt: Alt_.Alt<AsyncResultHkt> = {
  orElse,
}
