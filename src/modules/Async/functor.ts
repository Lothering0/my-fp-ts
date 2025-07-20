import * as F from "../../types/Functor"
import { AsyncHKT, Async, toPromise } from "./async"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<AsyncHKT> = {
  map: overload (
    1,
    <A, B>(self: Async<A>, ab: (a: A) => B): Async<B> =>
      () =>
        toPromise (self).then (ab),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Async<A>) => Async<B>
  <A, B>(self: Async<A>, ab: (a: A) => B): Async<B>
} = Functor.map
