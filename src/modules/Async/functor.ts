import * as Functor_ from '../../typeclasses/Functor'
import { AsyncHkt, Async, toPromise } from './async'

export const Functor: Functor_.Functor<AsyncHkt> = {
  map: ab => self => () => toPromise(self).then(ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Async<A>) => Async<B>
} = Functor.map
