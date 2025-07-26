import * as F from "../../types/Functor"
import { SyncHKT, Sync, execute } from "./sync"
import { pipe } from "../../utils/flow"

export const Functor: F.Functor<SyncHKT> = {
  map: ab => self => () => pipe (self, execute, ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Sync<A>) => Sync<B>
} = Functor.map
