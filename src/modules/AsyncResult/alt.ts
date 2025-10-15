import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import { AsyncResult, AsyncResultHkt } from './async-result'
import { _AsyncResult } from './internal'

export const getOrElse: {
  <B, E>(
    onFailure: (failure: E) => B,
  ): <A>(self: AsyncResult<A, E>) => Async.Async<A | B>
} = _AsyncResult.getOrElse

export const orElse: {
  <B, E>(
    onFailure: AsyncResult<B, E>,
  ): <A>(self: AsyncResult<A, unknown>) => AsyncResult<A | B, E>
} = _AsyncResult.orElse

export const catchAll: {
  <A, B, E1, E2>(
    onFailure: (failure: E1) => AsyncResult<B, E2>,
  ): (self: AsyncResult<A, E1>) => AsyncResult<A | B, E2>
} = _AsyncResult.catchAll

export const Alt: Alt_.Alt<AsyncResultHkt> = _AsyncResult.Alt
