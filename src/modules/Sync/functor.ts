import * as F from "../../types/Functor"
import { SyncHKT, Sync, execute } from "./sync"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<SyncHKT> = {
  map: overload (
    1,
    <A, B>(self: Sync<A>, ab: (a: A) => B): Sync<B> =>
      () =>
        pipe (self, execute, ab),
  ),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Sync<A>) => Sync<B>
  <A, B>(self: Sync<A>, ab: (a: A) => B): Sync<B>
} = Functor.map
