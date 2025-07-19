import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import { AsyncOptionHKT, toPromise, some } from "./async-option"
import { Compactable } from "../../types/Compactable"
import { zero } from "./alternative"
import { flatMap } from "./monad"
import { flow } from "../../utils/flow"

export const compactable: Compactable<AsyncOptionHKT> = {
  compact: self => () => toPromise (self).then (O.compact),
  compactResults: self => () => toPromise (self).then (O.compactResults),
  separate: flow (
    toPromise,
    ma => () => ma,
    mma =>
      S.make (
        flatMap (mma, R.match (some, zero)),
        flatMap (mma, R.match (zero, some)),
      ),
  ),
}

export const { compact, compactResults, separate } = compactable
