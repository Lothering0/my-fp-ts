import { Bifunctor as Bifunctor_ } from '../../typeclasses/Bifunctor'
import { SyncResultHkt, SyncResult } from './sync-result'
import { _SyncResult } from './internal'

export const Bifunctor: Bifunctor_<SyncResultHkt> = _SyncResult.Bifunctor

export const mapLeft: {
  <E, D>(ed: (failure: E) => D): <A>(self: SyncResult<A, E>) => SyncResult<A, D>
} = Bifunctor.mapLeft

export const bimap: {
  <E, D, A, B>(
    ed: (failure: E) => D,
    ab: (success: A) => B,
  ): (self: SyncResult<A, E>) => SyncResult<B, D>
} = Bifunctor.bimap
