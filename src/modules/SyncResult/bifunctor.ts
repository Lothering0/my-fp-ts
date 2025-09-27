import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { SyncResultHkt, SyncResult, execute } from './sync-result'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'

export const Bifunctor = create<SyncResultHkt>(Functor, {
  mapLeft: ed => self => () => pipe(self, execute, Result.mapLeft(ed)),
})

export const mapLeft: {
  <E, D>(ed: (failure: E) => D): <A>(self: SyncResult<A, E>) => SyncResult<A, D>
} = Bifunctor.mapLeft

export const bimap: {
  <E, D, A, B>(
    ed: (failure: E) => D,
    ab: (success: A) => B,
  ): (self: SyncResult<A, E>) => SyncResult<B, D>
} = Bifunctor.bimap
