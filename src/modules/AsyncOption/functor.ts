import * as Functor_ from '../../typeclasses/Functor'
import { AsyncOptionHkt, AsyncOption } from './async-option'
import { _AsyncOption } from './_internal'

export const Functor: Functor_.Functor<AsyncOptionHkt> = _AsyncOption.Functor

export const map: {
  <A, B>(ab: (a: A) => B): (self: AsyncOption<A>) => AsyncOption<B>
} = Functor.map

export const as: {
  <A>(a: A): (self: AsyncOption<unknown>) => AsyncOption<A>
} = Functor.as
