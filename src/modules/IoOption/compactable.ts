import * as O from "../Option"
import * as E from "../Either"
import * as S from "../Separated"
import { IoOptionHKT, fromIoOption, some } from "./io-option"
import { Compactable } from "../../types/Compactable"
import { pipe } from "../../utils/flow"
import { zero } from "./utils"
import { flatMap } from "./monad"

export const compactable: Compactable<IoOptionHKT> = {
  compact: mma => () => pipe (mma, fromIoOption, O.compact),
  compactEithers: mma => () => pipe (mma, fromIoOption, O.compactEithers),
  separate: mma =>
    S.make (
      flatMap (mma, E.match (some, zero)),
      flatMap (mma, E.match (zero, some)),
    ),
}

export const { compact, compactEithers, separate } = compactable
