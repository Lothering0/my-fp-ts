import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { SyncOption, SyncOptionHKT, execute, some, none } from "./sync-option"
import { flow, pipe } from "../../utils/flow"
import { zero } from "./alternative"

export const Compactable: C.Compactable<SyncOptionHKT> = {
  compact: self => () => pipe (self, execute, O.compact),
  compactResults: self => () => pipe (self, execute, O.compactResults),
  separate: flow (
    execute,
    O.match (
      () => S.make (none, none),
      ma =>
        S.make (pipe (ma, R.match (some, zero)), pipe (ma, R.match (zero, some))),
    ),
  ),
}

export const compact: {
  <A>(self: SyncOption<O.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<R.Result<unknown, A>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: SyncOption<R.Result<E, A>>,
  ): S.Separated<SyncOption<E>, SyncOption<A>>
} = Compactable.separate
