import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { SyncResultHkt, SyncResult, execute } from './sync-result'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'

export const Bifunctor = create<SyncResultHkt>(Functor, {
  mapLeft: ed => self => () => pipe(self, execute, Result.mapLeft(ed)),
})

export const mapLeft: {
  <FailureIn, FailureOut>(
    ed: (failure: FailureIn) => FailureOut,
  ): <Out>(self: SyncResult<FailureIn, Out>) => SyncResult<FailureOut, Out>
} = Bifunctor.mapLeft

export const bimap: {
  <FailureIn, In, FailureOut, Out>(
    ed: (failure: FailureIn) => FailureOut,
    ab: (success: In) => Out,
  ): (self: SyncResult<FailureIn, In>) => SyncResult<FailureOut, Out>
} = Bifunctor.bimap
