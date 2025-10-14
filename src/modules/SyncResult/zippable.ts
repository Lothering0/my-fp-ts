import * as Zippable_ from '../../typeclasses/Zippable'
import { _SyncResult } from './internal'
import { SyncResult, SyncResultHkt } from './sync-result'

export const Zippable: Zippable_.Zippable<SyncResultHkt> = _SyncResult.Zippable

export const zipWith: {
  <A, B, D, C>(
    that: SyncResult<B, D>,
    f: (a: A, b: B) => C,
  ): <E>(self: SyncResult<A, E>) => SyncResult<C, E | D>
} = Zippable.zipWith

export const zip: {
  <A, B, D>(
    that: SyncResult<B, D>,
  ): <E>(self: SyncResult<A, E>) => SyncResult<readonly [A, B], E | D>
} = Zippable.zip

export const unzip: {
  <A, B, E>(
    zipped: SyncResult<readonly [A, B], E>,
  ): readonly [SyncResult<A, E>, SyncResult<B, E>]
} = Zippable.unzip
