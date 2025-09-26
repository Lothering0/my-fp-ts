import * as alt from '../../typeclasses/Alt'
import * as async from '../Async'
import * as result from '../Result'
import { identity } from '../Identity'
import { AsyncResult, AsyncResultHkt, succeed } from './async-result'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const getOrElse: {
  <Failure, Out>(
    onFailure: (failure: Failure) => Out,
  ): <In>(self: AsyncResult<Failure, In>) => async.Async<In | Out>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse =
  <Failure1, Out>(onFailure: AsyncResult<Failure1, Out>) =>
  <Failure2, In>(
    self: AsyncResult<Failure2, In>,
  ): AsyncResult<Failure1 | Failure2, In | Out> =>
    pipe(
      self,
      async.flatMap(
        result.match({
          onFailure: constant(onFailure),
          onSuccess: succeed<In & Out>,
        }),
      ),
    )

export const catchAll =
  <Failure1, Failure2, In, Out>(
    onFailure: (failure: Failure1) => AsyncResult<Failure2, Out>,
  ) =>
  (self: AsyncResult<Failure1, In>): AsyncResult<Failure2, In | Out> =>
    pipe(
      self,
      async.flatMap(
        result.match({
          onFailure,
          onSuccess: succeed<In & Out>,
        }),
      ),
    )

export const Alt: alt.Alt<AsyncResultHkt> = {
  orElse,
}
