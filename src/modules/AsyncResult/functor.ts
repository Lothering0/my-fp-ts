import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, AsyncResult } from './async-result'
import { _AsyncResult } from './_internal'

export const Functor: Functor_.Functor<Hkt> = _AsyncResult.Functor

export const map: {
  <A, B>(
    ab: (a: A) => B,
  ): <E>(asyncResult: AsyncResult<A, E>) => AsyncResult<B, E>
} = Functor.map

export const as: {
  <A>(a: A): <E>(asyncResult: AsyncResult<unknown, E>) => AsyncResult<A, E>
} = Functor.as
