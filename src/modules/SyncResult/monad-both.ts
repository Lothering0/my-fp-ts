import * as MonadBoth_ from '../../typeclasses/MonadBoth'
import { _SyncResult } from './_internal'
import { SyncResult, Hkt } from './sync-result'

export const MonadBoth: MonadBoth_.MonadBoth<Hkt> = _SyncResult.MonadBoth

export const flatLeft: {
  <A, B, E>(syncResult: SyncResult<A, SyncResult<B, E>>): SyncResult<A | B, E>
} = MonadBoth.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => SyncResult<A, D>,
  ): <B>(syncResult: SyncResult<B, E>) => SyncResult<A | B, D>
} = MonadBoth.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    amb: (e: E1) => SyncResult<A, E2>,
    bmc: (d: E2) => SyncResult<A, D>,
  ): (e: E1) => SyncResult<A, D>
} = MonadBoth.composeLeft
