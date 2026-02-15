import * as Zippable_ from '../../typeclasses/Zippable'
import { _SyncResult } from './_internal'
import { SyncResult, Hkt } from './sync-result'

export const Zippable: Zippable_.Zippable<Hkt> = _SyncResult.Zippable

export const zipWith: {
  <A, B, D, C>(
    syncResult: SyncResult<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(selfSyncResult: SyncResult<A, E>) => SyncResult<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    syncResult: SyncResult<B, D>,
  ): <E>(selfSyncResult: SyncResult<A, E>) => SyncResult<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: SyncResult<readonly [A, B], E>,
  ): readonly [SyncResult<A, E>, SyncResult<B, E>]
} = Zippable.unzip
