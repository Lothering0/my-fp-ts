import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import { AsyncResult, Hkt } from './async-result'
import { _AsyncResult } from './_internal'
import { Tag, Tagged } from '../../types/Tag'
import { pipe } from '../../utils/flow'

export const getOrElse: {
  <B, E>(
    onFailure: (failure: E) => B,
  ): <A>(asyncResult: AsyncResult<A, E>) => Async.Async<A | B>
} = _AsyncResult.getOrElse

export const orElse: {
  <B, E>(
    onFailure: AsyncResult<B, E>,
  ): <A>(asyncResult: AsyncResult<A, unknown>) => AsyncResult<A | B, E>
} = _AsyncResult.orElse

export const orElseSucceed: {
  <B>(
    onFailure: B,
  ): <A>(asyncResult: AsyncResult<A, unknown>) => AsyncResult<A | B>
} = _AsyncResult.orElseSucceed

export const orElseFail: {
  <E>(
    onFailure: E,
  ): <A>(asyncResult: AsyncResult<A, unknown>) => AsyncResult<A, E>
} = _AsyncResult.orElseFail

export const catchAll: {
  <A, B, E1, E2>(
    onFailure: (failure: E1) => AsyncResult<B, E2>,
  ): (asyncResult: AsyncResult<A, E1>) => AsyncResult<A | B, E2>
} = _AsyncResult.catchAll

export const catchTag =
  <A, B, E1 extends Tagged, E2, T extends Tag<E1>>(
    tag: T,
    onFailure: (
      // Passing to callback exactly tagged object
      failure: E1 extends Tagged<T> ? E1 : never,
    ) => AsyncResult<B, E2>,
  ) =>
  (
    asyncResult: AsyncResult<A, E1>,
    // Removing catched tag from result. Leave only uncatched
  ): AsyncResult<A | B, (E1 extends Tagged<T> ? never : E1) | E2> =>
    pipe(asyncResult, _AsyncResult.catchTag(tag, onFailure))

export const Alt: Alt_.Alt<Hkt> = _AsyncResult.Alt
