import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { ArrayHKT } from "./array"
import { of } from "./applicative"
import { flatMap } from "./monad"
import { reduce } from "./foldable"
import { successes } from "./utils"
import { constEmptyArray } from "../../utils/constant"

const getInitialSeparated: {
  <E, A>(): S.Separated<E[], A[]>
} = () => S.make ([], [])

export const Compactable: C.Compactable<ArrayHKT> = {
  compact: flatMap (O.match (constEmptyArray, of)),
  compactResults: successes,
  separate: reduce (getInitialSeparated (), (b, ma) =>
    R.match (
      ma,
      e => S.make ([...S.left (b), e], S.right (b)),
      a => S.make (S.left (b), [...S.right (b), a]),
    ),
  ),
}

export const compact: {
  <A>(self: O.Option<A>[]): A[]
} = Compactable.compact

export const compactResults: {
  <A>(self: R.Result<unknown, A>[]): A[]
} = Compactable.compactResults

export const separate: {
  <E, A>(self: R.Result<E, A>[]): S.Separated<E[], A[]>
} = Compactable.separate
