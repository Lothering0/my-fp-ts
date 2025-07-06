import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import { SyncOptionHKT, fromSyncOption, some } from "./sync-option"
import { Compactable } from "../../types/Compactable"
import { pipe } from "../../utils/flow"
import { zero } from "./utils"
import { flatMap } from "./monad"

export const compactable: Compactable<SyncOptionHKT> = {
  compact: mma => () => pipe (mma, fromSyncOption, O.compact),
  compactResults: mma => () => pipe (mma, fromSyncOption, O.compactResults),
  separate: mma =>
    S.make (
      flatMap (mma, R.match (some, zero)),
      flatMap (mma, R.match (zero, some)),
    ),
}

export const { compact, compactResults, separate } = compactable
