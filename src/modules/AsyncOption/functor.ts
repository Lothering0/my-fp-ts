import * as Functor_ from '../../typeclasses/Functor'
import { AsyncOptionHkt, AsyncOption } from './async-option'
import { _AsyncOption } from './internal'

export const Functor: Functor_.Functor<AsyncOptionHkt> = _AsyncOption.Functor

export const map: {
  <A, B>(ab: (a: A) => B): (self: AsyncOption<A>) => AsyncOption<B>
} = Functor.map
