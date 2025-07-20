import * as SR from "../SyncResult"
import * as O from "../Option"
import { Result } from "../Result"
import { createMonad } from "../../types/Monad"
import { Applicative } from "./applicative"
import { pipe } from "../../utils/flow"
import { SyncOptionHKT, execute, SyncOption } from "./sync-option"
import { overload } from "../../utils/overloads"

export const Monad = createMonad<SyncOptionHKT> ({
  ...Applicative,
  flat: self => () =>
    pipe (self, execute, ma =>
      O.isNone (ma) ? ma : pipe (ma, O.fromSome, execute),
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
} = Monad

export const tapOption: {
  <A, _>(f: (a: A) => O.Option<_>): (self: SyncOption<A>) => SyncOption<A>
  <A, _>(self: SyncOption<A>, f: (a: A) => O.Option<_>): SyncOption<A>
} = overload (1, (self, f) => () => pipe (self, execute, O.tap (f)))

export const tapResult: {
  <E, A, _>(f: (a: A) => Result<E, _>): (self: SyncOption<A>) => SyncOption<A>
  <E, A, _>(self: SyncOption<A>, f: (a: A) => Result<E, _>): SyncOption<A>
} = overload (1, (self, f) => () => pipe (self, execute, O.tapResult (f)))

export const tapSyncResult: {
  <E, A, _>(
    f: (a: A) => SR.SyncResult<E, _>,
  ): (self: SyncOption<A>) => SyncOption<A>
  <E, A, _>(
    self: SyncOption<A>,
    f: (a: A) => SR.SyncResult<E, _>,
  ): SyncOption<A>
} = overload (
  1,
  (self, f) => () =>
    pipe (
      self,
      execute,
      O.tap (a => pipe (a, f, SR.execute, O.fromResult)),
    ),
)
