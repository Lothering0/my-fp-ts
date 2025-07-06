import { Functor } from "../../types/Functor"
import { SyncHKT, Sync, fromSync } from "./sync"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<SyncHKT> = {
  map: overload (
    1,
    <A, B>(self: Sync<A>, ab: (a: A) => B): Sync<B> =>
      () =>
        pipe (self, fromSync, ab),
  ),
}

export const { map } = functor
