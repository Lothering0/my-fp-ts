import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import { ArrayHKT } from "./array"
import { Compactable } from "../../types/Compactable"
import { flatMap } from "./monad"
import { reduce } from "./foldable"

type GetInitialSeparated = <E, A>() => S.Separated<E[], A[]>
const getInitialSeparated: GetInitialSeparated = () => S.make ([], [])

export const compactable: Compactable<ArrayHKT> = {
  compact: flatMap (a => O.isNone (a) ? [] : [O.fromSome (a)]),
  compactResults: flatMap (a => R.isFailure (a) ? [] : [R.fromSuccess (a)]),
  separate: reduce (getInitialSeparated (), (b, ma) =>
    R.match (
      ma,
      e => S.make ([...S.left (b), e], S.right (b)),
      a => S.make (S.left (b), [...S.right (b), a]),
    ),
  ),
}

export const { compact, compactResults, separate } = compactable
