import * as Alt_ from '../../typeclasses/Alt'
import { Sync } from '../Sync'
import { SyncResult, SyncResultHkt } from './sync-result'
import { _SyncResult } from './internal'

export const getOrElse: {
  <B, E>(onFailure: (e: E) => B): <A>(self: SyncResult<A, E>) => Sync<A | B>
} = _SyncResult.getOrElse

export const orElse: {
  <B, E>(
    onFailure: SyncResult<B, E>,
  ): <A>(self: SyncResult<A, unknown>) => SyncResult<A | B, E>
} = _SyncResult.orElse

export const catchAll: {
  <B, E1, E2>(
    onFailure: (e: E1) => SyncResult<B, E2>,
  ): <A>(self: SyncResult<A, E1>) => SyncResult<A | B, E2>
} = _SyncResult.catchAll

export const Alt: Alt_.Alt<SyncResultHkt> = _SyncResult.Alt
