import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import { AsyncOptionHKT, fromAsyncOption, some } from "./async-option"
import { Compactable } from "../../types/Compactable"
import { zero } from "./utils"
import { flatMap } from "./monad"
import { flow } from "../../utils/flow"

export const compactable: Compactable<AsyncOptionHKT> = {
  compact: self => () => fromAsyncOption (self).then (O.compact),
  compactResults: self => () => fromAsyncOption (self).then (O.compactResults),
  separate: flow (
    fromAsyncOption,
    ma => () => ma,
    mma =>
      S.make (
        flatMap (mma, R.match (some, zero)),
        flatMap (mma, R.match (zero, some)),
      ),
  ),
}

export const { compact, compactResults, separate } = compactable
