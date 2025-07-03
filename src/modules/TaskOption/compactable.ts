import * as O from "../Option"
import * as E from "../Either"
import * as S from "../Separated"
import { TaskOptionHKT, fromTaskOption, some } from "./task-option"
import { Compactable } from "../../types/Compactable"
import { zero } from "./utils"
import { flatMap } from "./monad"
import { flow } from "../../utils/flow"

export const compactable: Compactable<TaskOptionHKT> = {
  compact: mma => () => fromTaskOption (mma).then (O.compact),
  compactEithers: mma => () => fromTaskOption (mma).then (O.compactEithers),
  separate: flow (
    fromTaskOption,
    ma => () => ma,
    mma =>
      S.make (
        flatMap (mma, E.match (some, zero)),
        flatMap (mma, E.match (zero, some)),
      ),
  ),
}

export const { compact, compactEithers, separate } = compactable
