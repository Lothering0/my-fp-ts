import * as functor from "../../types/Functor"
import { SyncHKT, Sync, execute } from "./sync"
import { pipe } from "../../utils/flow"

export const Functor: functor.Functor<SyncHKT> = {
  map: ab => self => () => pipe (self, execute, ab),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Sync<A>) => Sync<B>
} = Functor.map
