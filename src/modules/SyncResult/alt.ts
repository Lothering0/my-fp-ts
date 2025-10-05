import * as Alt_ from '../../typeclasses/Alt'
import * as Result from '../Result'
import { Sync } from '../Sync'
import { identity } from '../Identity'
import { SyncResult, SyncResultHkt, execute, succeed } from './sync-result'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { flow } from '../../utils/flow'

export const getOrElse: {
  <B, E>(onFailure: (e: E) => B): <A>(self: SyncResult<A, E>) => Sync<A | B>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse: {
  <B, E>(
    onFailure: SyncResult<B, E>,
  ): <A>(self: SyncResult<A>) => SyncResult<A | B, E>
} = onFailure =>
  flow(
    execute,
    Result.match({
      onFailure: constant(onFailure),
      onSuccess: succeed,
    }),
  )

export const catchAll: {
  <B, E1, E2>(
    onFailure: (e: E1) => SyncResult<B, E2>,
  ): <A>(self: SyncResult<A, E1>) => SyncResult<A | B, E2>
} = onFailure =>
  flow(
    execute,
    Result.match({
      onFailure,
      onSuccess: succeed,
    }),
  )

export const Alt: Alt_.Alt<SyncResultHkt> = {
  orElse,
}
