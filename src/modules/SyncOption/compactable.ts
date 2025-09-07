import * as option from "../Option"
import * as result from "../Result"
import * as separated from "../Separated"
import * as compactable from "../../typeclasses/Compactable"
import { SyncOption, SyncOptionHkt, execute, some, none } from "./sync-option"
import { flow, pipe } from "../../utils/flow"
import { zero } from "./alternative"

export const Compactable: compactable.Compactable<SyncOptionHkt> = {
  compact: self => () => pipe (self, execute, option.compact),
  compactResults: self => () => pipe (self, execute, option.compactResults),
  separate: flow (
    execute,
    option.match ({
      onNone: () => separated.make (none, none),
      onSome: ma =>
        separated.make (
          pipe (ma, result.match ({ onFailure: some, onSuccess: zero })),
          pipe (ma, result.match ({ onFailure: zero, onSuccess: some })),
        ),
    }),
  ),
}

export const compact: {
  <A>(self: SyncOption<option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<result.Result<unknown, A>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: SyncOption<result.Result<E, A>>,
  ): separated.Separated<SyncOption<E>, SyncOption<A>>
} = Compactable.separate
