import * as R from "../Result"
import * as S from "../Separated"
import { OptionHKT, some } from "./option"
import { Compactable } from "../../types/Compactable"
import { flat, flatMap } from "./monad"
import { fromResult, zero } from "./utils"

export const compactable: Compactable<OptionHKT> = {
  compact: flat,
  compactResults: flatMap (fromResult),
  separate: self =>
    S.make (
      flatMap (self, R.match (some, zero)),
      flatMap (self, R.match (zero, some)),
    ),
}

export const { compact, compactResults, separate } = compactable
