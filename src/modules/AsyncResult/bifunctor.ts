import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'
import { Functor } from './functor'

export const Bifunctor = create<AsyncResultHkt>(Functor, {
  mapLeft: ed => self => () => toPromise(self).then(Result.mapLeft(ed)),
})

export const mapLeft: {
  <FailureIn, FailureOut>(
    ed: (failure: FailureIn) => FailureOut,
  ): <Out>(self: AsyncResult<FailureIn, Out>) => AsyncResult<FailureOut, Out>
} = Bifunctor.mapLeft

export const bimap: {
  <FailureIn, In, FailureOut, Out>(
    ed: (e: FailureIn) => FailureOut,
    ab: (a: In) => Out,
  ): (self: AsyncResult<FailureIn, In>) => AsyncResult<FailureOut, Out>
} = Bifunctor.bimap
