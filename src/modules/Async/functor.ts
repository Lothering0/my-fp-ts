import * as Functor_ from '../../typeclasses/Functor'
import { AsyncHkt, Async, toPromise } from './async'

export const Functor: Functor_.Functor<AsyncHkt> = {
  map: ab => self => () => toPromise(self).then(ab),
}

export const map: {
  <In, Out>(ab: (a: In) => Out): (self: Async<In>) => Async<Out>
} = Functor.map
