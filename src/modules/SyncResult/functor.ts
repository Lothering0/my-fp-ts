import * as R from "../Result"
import * as F from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { SyncResultHKT, SyncResult, execute } from "./sync-result"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const Functor: F.Functor<SyncResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: SyncResult<_, A>, ab: (a: A) => B): SyncResult<_, B> =>
      () =>
        pipe (self, execute, R.map (ab)),
  ),
}

export const Bifunctor = createBifunctor<SyncResultHKT> ({
  ...Functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: SyncResult<E, _>, ed: (e: E) => D): SyncResult<D, _> =>
      () =>
        pipe (self, execute, R.mapLeft (ed)),
  ),
})

export const map: {
  <_, A, B>(ab: (a: A) => B): (self: SyncResult<_, A>) => SyncResult<_, B>
  <_, A, B>(self: SyncResult<_, A>, ab: (a: A) => B): SyncResult<_, B>
} = Functor.map

export const mapLeft: {
  <E, _, D>(ed: (e: E) => D): (self: SyncResult<E, _>) => SyncResult<D, _>
  <E, _, D>(self: SyncResult<E, _>, ed: (e: E) => D): SyncResult<D, _>
} = Bifunctor.mapLeft

export const bimap: {
  <E, A, D, B>(
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): (self: SyncResult<E, A>) => SyncResult<D, B>
  <E, A, D, B>(
    self: SyncResult<E, A>,
    ed: (e: E) => D,
    ab: (a: A) => B,
  ): SyncResult<D, B>
} = Bifunctor.bimap
