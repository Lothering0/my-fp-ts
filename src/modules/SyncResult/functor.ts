import * as result from "../Result"
import * as functor from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { SyncResultHkt, SyncResult, execute } from "./sync-result"
import { pipe } from "../../utils/flow"

export const Functor: functor.Functor<SyncResultHkt> = {
  map: ab => self => () => pipe (self, execute, result.map (ab)),
}

export const Bifunctor = createBifunctor<SyncResultHkt> ({
  ...Functor,
  mapLeft: ed => self => () => pipe (self, execute, result.mapLeft (ed)),
})

export const map: {
  <A, B>(ab: (a: A) => B): <E>(self: SyncResult<E, A>) => SyncResult<E, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <A>(self: SyncResult<E, A>) => SyncResult<D, A>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: SyncResult<E, A>) => SyncResult<D, B>
} = Bifunctor.bimap
