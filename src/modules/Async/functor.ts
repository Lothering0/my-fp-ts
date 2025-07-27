import * as functor from "../../types/Functor"
import { AsyncHKT, Async, toPromise } from "./async"

export const Functor: functor.Functor<AsyncHKT> = {
  map: ab => self => () => toPromise (self).then (ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Async<A>) => Async<B>
} = Functor.map
