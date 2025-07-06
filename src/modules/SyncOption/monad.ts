import * as SR from "../SyncResult"
import * as O from "../Option"
import { Result } from "../Result"
import { createMonad } from "../../types/Monad"
import { applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { SyncOptionHKT, fromSyncOption, SyncOption } from "./sync-option"
import { overload } from "../../utils/overloads"

export const monad = createMonad<SyncOptionHKT> ({
  ...applicative,
  flat: self => () =>
    pipe (self, fromSyncOption, ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, fromSyncOption),
    ),
})

export const {
  Do,
  flat,
  flatMap,
  compose,
  setTo,
  mapTo,
  applyTo,
  apS,
  flatMapTo,
  tap,
  tapSync,
} = monad

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: SyncOption<A>) => SyncOption<A>
  <A, _>(self: SyncOption<A>, f: (a: A) => O.Option<_>): SyncOption<A>
} = overload (1, (mma, f) => () => pipe (mma (), O.tap (f)))

export const tapResult: {
  <E, A, _>(f: (a: A) => Result<E, _>): (self: SyncOption<A>) => SyncOption<A>
  <E, A, _>(self: SyncOption<A>, f: (a: A) => Result<E, _>): SyncOption<A>
} = overload (1, (mma, f) => () => pipe (mma (), O.tapResult (f)))

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (ma: SyncOption<A>) => SyncOption<A>
  <E, A, _>(ma: SyncOption<A>, f: (a: A) => SR.SyncResult<E, _>): SyncOption<A>
} = overload (
  1,
  (mma, f) => () =>
    pipe (
      mma (),
      O.tap (a => pipe (a, f, SR.fromSyncResult, O.fromResult)),
    ),
)
