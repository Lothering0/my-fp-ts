import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { OptionHKT, some } from "./option"
import { flat, flatMap } from "./monad"
import { fromResult, zero } from "./utils"

export const Compactable: C.Compactable<OptionHKT> = {
  compact: flat,
  compactResults: flatMap (fromResult),
  separate: self =>
    S.make (
      flatMap (self, R.match (some, zero)),
      flatMap (self, R.match (zero, some)),
    ),
}

export const { compact, compactResults, separate } = Compactable
