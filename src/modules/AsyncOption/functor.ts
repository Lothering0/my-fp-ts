import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, AsyncOption } from './async-option'
import { _AsyncOption } from './_internal'

export const Functor: Functor_.Functor<Hkt> = _AsyncOption.Functor

export const map: {
  <A, B>(ab: (a: A) => B): (asyncOption: AsyncOption<A>) => AsyncOption<B>
} = Functor.map

export const as: {
  <A>(a: A): (asyncOption: AsyncOption<unknown>) => AsyncOption<A>
} = Functor.as
