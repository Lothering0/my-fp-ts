import { Functor } from "../../types/Functor"
import { AsyncHKT, Async, fromAsync } from "./async"
import { overload } from "../../utils/overloads"

export const functor: Functor<AsyncHKT> = {
  map: overload (
    1,
    <A, B>(self: Async<A>, ab: (a: A) => B): Async<B> =>
      () =>
        fromAsync (self).then (ab),
  ),
}

export const { map } = functor
