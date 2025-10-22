import * as Bimonad_ from '../../typeclasses/Bimonad'
import { _SyncResult } from './internal'
import { SyncResult, SyncResultHkt } from './sync-result'

export const Bimonad: Bimonad_.Bimonad<SyncResultHkt> = _SyncResult.Bimonad

export const flatLeft: {
  <A, B, E>(self: SyncResult<A, SyncResult<B, E>>): SyncResult<A | B, E>
} = Bimonad.flatLeft

export const flatMapLeft: {
  <A, E, D>(
    emd: (e: E) => SyncResult<A, D>,
  ): <B>(self: SyncResult<B, E>) => SyncResult<A | B, D>
} = Bimonad.flatMapLeft

export const composeLeft: {
  <A, E1, E2, D>(
    bmc: (d: E2) => SyncResult<A, D>,
    amb: (e: E1) => SyncResult<A, E2>,
  ): (e: E1) => SyncResult<A, D>
} = Bimonad.composeLeft
