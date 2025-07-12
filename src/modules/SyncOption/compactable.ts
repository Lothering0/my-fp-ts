import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { SyncOptionHKT, fromSyncOption, some } from "./sync-option"
import { pipe } from "../../utils/flow"
import { zero } from "./utils"
import { flatMap } from "./monad"

export const Compactable: C.Compactable<SyncOptionHKT> = {
  compact: mma => () => pipe (mma, fromSyncOption, O.compact),
  compactResults: mma => () => pipe (mma, fromSyncOption, O.compactResults),
  separate: mma =>
    S.make (
      flatMap (mma, R.match (some, zero)),
      flatMap (mma, R.match (zero, some)),
    ),
}

export const { compact, compactResults, separate } = Compactable
