import * as Alt_ from '../../typeclasses/Alt'
import { Sync } from '../Sync'
import { SyncResult, SyncResultHkt } from './sync-result'
import { _SyncResult } from './_internal'
import { Tag, Tagged } from '../../types/Tag'
import { pipe } from '../../utils/flow'

export const getOrElse: {
  <B, E>(onFailure: (e: E) => B): <A>(self: SyncResult<A, E>) => Sync<A | B>
} = _SyncResult.getOrElse

export const orElse: {
  <B, E>(
    onFailure: SyncResult<B, E>,
  ): <A>(self: SyncResult<A, unknown>) => SyncResult<A | B, E>
} = _SyncResult.orElse

export const orElseSucceed: {
  <B>(onFailure: B): <A>(self: SyncResult<A, unknown>) => SyncResult<A | B>
} = _SyncResult.orElseSucceed

export const orElseFail: {
  <E>(onFailure: E): <A>(self: SyncResult<A, unknown>) => SyncResult<A, E>
} = _SyncResult.orElseFail

export const catchAll: {
  <B, E1, E2>(
    onFailure: (e: E1) => SyncResult<B, E2>,
  ): <A>(self: SyncResult<A, E1>) => SyncResult<A | B, E2>
} = _SyncResult.catchAll

export const catchTag =
  <A, B, E1 extends Tagged, E2, T extends Tag<E1>>(
    tag: T,
    onFailure: (
      // Passing to callback exactly tagged object
      failure: E1 extends Tagged<T> ? E1 : never,
    ) => SyncResult<B, E2>,
  ) =>
  (
    self: SyncResult<A, E1>,
    // Removing catched tag from result. Leave only uncatched
  ): SyncResult<A | B, (E1 extends Tagged<T> ? never : E1) | E2> =>
    pipe(self, _SyncResult.catchTag(tag, onFailure))

export const Alt: Alt_.Alt<SyncResultHkt> = _SyncResult.Alt
