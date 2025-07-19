import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { SyncOptionHKT, fromSyncOption, some, none } from "./sync-option"
import { flow, pipe } from "../../utils/flow"
import { zero } from "./alternative"

export const Compactable: C.Compactable<SyncOptionHKT> = {
  compact: self => () => pipe (self, fromSyncOption, O.compact),
  compactResults: self => () => pipe (self, fromSyncOption, O.compactResults),
  separate: flow (
    fromSyncOption,
    O.match (
      () => S.make (none, none),
      ma => S.make (R.match (ma, some, zero), R.match (ma, zero, some)),
    ),
  ),
}

export const { compact, compactResults, separate } = Compactable
