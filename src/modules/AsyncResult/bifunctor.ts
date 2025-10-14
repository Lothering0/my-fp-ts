import { Bifunctor as Bifunctor_ } from '../../typeclasses/Bifunctor'
import { AsyncResultHkt, AsyncResult } from './async-result'
import { _AsyncResult } from './internal'

export const Bifunctor: Bifunctor_<AsyncResultHkt> = _AsyncResult.Bifunctor

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
