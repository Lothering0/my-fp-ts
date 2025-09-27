import * as Functor_ from '../../typeclasses/Functor'
import { Identity, IdentityHkt } from './identity'

export const Functor: Functor_.Functor<IdentityHkt> = {
  map: ab => self => ab(self),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Identity<A>) => Identity<B>
} = Functor.map
