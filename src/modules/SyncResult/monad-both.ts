import * as MonadBoth_ from '../../typeclasses/MonadBoth'
import { _SyncResult } from './_internal'
import { SyncResult, SyncResultHkt } from './sync-result'

export const MonadBoth: MonadBoth_.MonadBoth<SyncResultHkt> =
  _SyncResult.MonadBoth

export const flatLeft: {
  <A, B, E>(self: SyncResult<A, SyncResult<B, E>>): SyncResult<A | B, E>
} = MonadBoth.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => SyncResult<A, D>,
  ): <B>(self: SyncResult<B, E>) => SyncResult<A | B, D>
} = MonadBoth.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => SyncResult<A, D>,
    amb: (e: E1) => SyncResult<A, E2>,
  ): (e: E1) => SyncResult<A, D>
} = MonadBoth.composeLeft
