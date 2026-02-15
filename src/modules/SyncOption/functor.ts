import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, SyncOption } from './sync-option'
import { _SyncOption } from './_internal'

export const Functor: Functor_.Functor<Hkt> = _SyncOption.Functor

export const map: {
  <A, B>(ab: (a: A) => B): (syncOption: SyncOption<A>) => SyncOption<B>
} = Functor.map

export const as: {
  <A>(a: A): (syncOption: SyncOption<unknown>) => SyncOption<A>
} = Functor.as
