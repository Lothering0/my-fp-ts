import * as Result from '../Result'
import { create } from '../../typeclasses/Bifunctor'
import { AsyncResultHkt, toPromise, AsyncResult } from './async-result'
import { Functor } from './functor'

export const Bifunctor = create<AsyncResultHkt>(Functor, {
  mapLeft: ed => self => () => toPromise(self).then(Result.mapLeft(ed)),
})

export const mapLeft: {
  <E, D>(
    ed: (failure: E) => D,
  ): <A>(self: AsyncResult<A, E>) => AsyncResult<A, D>
} = Bifunctor.mapLeft

export const bimap: {
  <E, D, A, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: AsyncResult<A, E>) => AsyncResult<B, D>
} = Bifunctor.bimap
