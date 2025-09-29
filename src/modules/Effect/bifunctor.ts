import * as SyncResult from '../SyncResult'
import * as AsyncResult from '../AsyncResult'
import { create } from '../../typeclasses/Bifunctor'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'
import { Effect, EffectHkt, fromAsyncResult, fromSyncResult } from './effect'

export const Bifunctor = create<EffectHkt>(Functor, {
  mapLeft: ed => self => {
    if (self._tag === 'Sync') {
      return pipe(self.syncResult, SyncResult.mapLeft(ed), fromSyncResult)
    }

    return pipe(self.asyncResult, AsyncResult.mapLeft(ed), fromAsyncResult)
  },
})

export const mapLeft: {
  <E1, E2>(ed: (failure: E1) => E2): <A>(self: Effect<A, E1>) => Effect<A, E2>
} = Bifunctor.mapLeft

export const bimap: {
  <E1, E2, A, B>(
    ed: (failure: E1) => E2,
    ab: (success: A) => B,
  ): (self: Effect<A, E1>) => Effect<B, E2>
} = Bifunctor.bimap
