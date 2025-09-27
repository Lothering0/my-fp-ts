import * as Alt_ from '../../typeclasses/Alt'
import * as Result from '../Result'
import { Sync } from '../Sync'
import { identity } from '../Identity'
import { SyncResult, SyncResultHkt, execute, succeed } from './sync-result'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { flow } from '../../utils/flow'

export const getOrElse: {
  <Collectable, Out>(
    onFailure: (e: Collectable) => Out,
  ): <In>(self: SyncResult<Collectable, In>) => Sync<In | Out>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse: {
  <Collectable1, Out>(
    onFailure: SyncResult<Collectable1, Out>,
  ): <Collectable2, In>(
    self: SyncResult<Collectable2, In>,
  ) => SyncResult<Collectable1 | Collectable2, In | Out>
} = onFailure =>
  flow(
    execute,
    Result.match({
      onFailure: constant(onFailure),
      onSuccess: succeed,
    }),
  )

export const catchAll: {
  <Collectable1, Collectable2, Out>(
    onFailure: (e: Collectable1) => SyncResult<Collectable2, Out>,
  ): <In>(
    self: SyncResult<Collectable1, In>,
  ) => SyncResult<Collectable2, In | Out>
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
