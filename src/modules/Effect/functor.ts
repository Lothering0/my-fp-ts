import * as Functor_ from '../../typeclasses/Functor'
import * as AsyncResult from '../AsyncResult'
import * as SyncResult from '../SyncResult'
import { Effect, EffectHkt, fromAsyncResult, fromSyncResult } from './effect'
import { pipe } from '../../utils/flow'

export const Functor: Functor_.Functor<EffectHkt> = {
  map: ab => self => {
    if (self._tag === 'Sync') {
      return pipe(self.syncResult, SyncResult.map(ab), fromSyncResult)
    }

    return pipe(self.asyncResult, AsyncResult.map(ab), fromAsyncResult)
  },
}

export const map: {
  <A, B>(ab: (success: A) => B): <E>(self: Effect<A, E>) => Effect<B, E>
} = Functor.map
