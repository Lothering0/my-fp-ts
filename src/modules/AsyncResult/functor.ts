import * as Functor_ from '../../typeclasses/Functor'
import { AsyncResultHkt, AsyncResult } from './async-result'
import { _AsyncResult } from './internal'

export const Functor: Functor_.Functor<AsyncResultHkt> = _AsyncResult.Functor

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: AsyncResult<A, E>) => AsyncResult<B, E>
} = Functor.map
