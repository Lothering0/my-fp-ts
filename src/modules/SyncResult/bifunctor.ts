import { Bifunctor as Bifunctor_ } from '../../typeclasses/Bifunctor'
import { Hkt, SyncResult } from './sync-result'
import { _SyncResult } from './_internal'

export const Bifunctor: Bifunctor_<Hkt> = _SyncResult.Bifunctor

export const mapLeft: {
  <E, D>(
    ed: (failure: E) => D,
  ): <A>(syncResult: SyncResult<A, E>) => SyncResult<A, D>
} = Bifunctor.mapLeft

export const bimap: {
  <E, D, A, B>(
    ed: (failure: E) => D,
    ab: (success: A) => B,
  ): (syncResult: SyncResult<A, E>) => SyncResult<B, D>
} = Bifunctor.bimap
