import * as O from "../Option"
import * as E from "../Either"
import * as S from "../Separated"
import { URI, fromTaskOption, some } from "./task-option"
import { Compactable } from "../../types/Compactable"
import { zero } from "./utils"
import { flatMap } from "./monad"

export const compactable: Compactable<URI> = {
  URI,
  compact: mma => () => fromTaskOption (mma).then (O.compact),
  compactEithers: mma => () => fromTaskOption (mma).then (O.compactEithers),
  separate: mma =>
    S.make (
      flatMap (mma, E.match (some, zero)),
      flatMap (mma, E.match (zero, some)),
    ),
}

export const { compact, compactEithers, separate } = compactable
