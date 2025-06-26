import * as E from "../Either"
import * as S from "../Separated"
import { URI, some } from "./option"
import { Compactable } from "../../types/Compactable"
import { flat, flatMap } from "./monad"
import { fromEither, zero } from "./utils"

export const compactable: Compactable<URI> = {
  URI,
  compact: flat,
  compactEithers: flatMap (fromEither),
  separate: mma =>
    S.make (
      flatMap (mma, E.match (some, zero)),
      flatMap (mma, E.match (zero, some)),
    ),
}

export const { compact, compactEithers, separate } = compactable
