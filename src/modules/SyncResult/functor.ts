import * as R from "../Result"
import { Functor } from "../../types/Functor"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { SyncResultHKT, SyncResult, fromSyncResult } from "./sync-result"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export const functor: Functor<SyncResultHKT> = {
  map: overload (
    1,
    <_, A, B>(self: SyncResult<_, A>, ab: (a: A) => B): SyncResult<_, B> =>
      () =>
        pipe (self, fromSyncResult, R.map (ab)),
  ),
}

export const bifunctor: Bifunctor<SyncResultHKT> = createBifunctor ({
  ...functor,
  mapLeft: overload (
    1,
    <E, _, D>(self: SyncResult<E, _>, ed: (e: E) => D): SyncResult<D, _> =>
      () =>
        pipe (self, fromSyncResult, R.mapLeft (ed)),
  ),
})

export const { map, mapLeft, bimap } = bifunctor
