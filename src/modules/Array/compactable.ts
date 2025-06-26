import * as O from "../Option"
import * as E from "../Either"
import * as S from "../Separated"
import { URI } from "./array"
import { Compactable } from "../../types/Compactable"
import { flatMap } from "./monad"
import { reduce } from "./foldable"

type GetInitialSeparated = <E, A>() => S.Separated<E[], A[]>
const getInitialSeparated: GetInitialSeparated = () => S.make ([], [])

export const compactable: Compactable<URI> = {
  URI,
  compact: flatMap (a => O.isNone (a) ? [] : [O.fromSome (a)]),
  compactEithers: flatMap (a => E.isLeft (a) ? [] : [E.fromRight (a)]),
  separate: reduce (getInitialSeparated (), (b, ma) =>
    E.match (
      ma,
      e => S.make ([...S.left (b), e], S.right (b)),
      a => S.make (S.left (b), [...S.right (b), a]),
    ),
  ),
}

export const { compact, compactEithers, separate } = compactable
