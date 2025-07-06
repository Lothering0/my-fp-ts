import * as E from "../Either"
import * as S from "../Separated"
import { OptionHKT, some } from "./option"
import { Compactable } from "../../types/Compactable"
import { flat, flatMap } from "./monad"
import { fromEither, zero } from "./utils"

export const compactable: Compactable<OptionHKT> = {
  compact: flat,
  compactEithers: flatMap (fromEither),
  separate: self =>
    S.make (
      flatMap (self, E.match (some, zero)),
      flatMap (self, E.match (zero, some)),
    ),
}

export const { compact, compactEithers, separate } = compactable
