import * as Functor_ from '../../typeclasses/Functor'
import { AsyncHkt, Async } from './async'

export const Functor: Functor_.Functor<AsyncHkt> = {
  // `Promise.resolve` for recursion optimization
  map: ab => self => () => Promise.resolve().then(self).then(ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Async<A>) => Async<B>
} = Functor.map
