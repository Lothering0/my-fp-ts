import * as R from "../Result"
import * as F from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { SyncResultHKT, SyncResult, execute } from "./sync-result"
import { pipe } from "../../utils/flow"

export const Functor: F.Functor<SyncResultHKT> = {
  map: ab => self => () => pipe (self, execute, R.map (ab)),
}

export const Bifunctor = createBifunctor<SyncResultHKT> ({
  ...Functor,
  mapLeft: ed => self => () => pipe (self, execute, R.mapLeft (ed)),
})

export const map: {
  <A, B>(ab: (a: A) => B): <_>(self: SyncResult<_, A>) => SyncResult<_, B>
} = Functor.map

export const mapLeft: {
  <E, D>(ed: (e: E) => D): <_>(self: SyncResult<E, _>) => SyncResult<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: SyncResult<E, A>) => SyncResult<D, B>
} = Bifunctor.bimap
