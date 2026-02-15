import * as Functor_ from '../../typeclasses/Functor'
import { AsyncHkt, Async } from './async'

export const Functor = Functor_.create<AsyncHkt>({
  // `Promise.resolve` for recursion optimization
  map: ab => async => () => Promise.resolve().then(async).then(ab),
})

export const map: {
  <A, B>(ab: (a: A) => B): (async: Async<A>) => Async<B>
} = Functor.map

export const as: {
  <A>(a: A): (async: Async<unknown>) => Async<A>
} = Functor.as
