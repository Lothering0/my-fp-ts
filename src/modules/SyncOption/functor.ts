import * as Functor_ from '../../typeclasses/Functor'
import { SyncOptionHkt, SyncOption } from './sync-option'
import { _SyncOption } from './_internal'

export const Functor: Functor_.Functor<SyncOptionHkt> = _SyncOption.Functor

export const map: {
  <A, B>(ab: (a: A) => B): (self: SyncOption<A>) => SyncOption<B>
} = Functor.map
