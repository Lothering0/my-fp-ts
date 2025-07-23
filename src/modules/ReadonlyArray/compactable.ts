import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { ReadonlyArrayHKT } from "./readonly-array"
import { of } from "./applicative"
import { flatMap } from "./monad"
import { reduce } from "./foldable"
import { successes, append, fromNonEmpty } from "./utils"
import { constEmptyArray } from "../../utils/constant"
import { pipe } from "../../utils/flow"

const getInitialSeparated: {
  <E, A>(): S.Separated<ReadonlyArray<E>, ReadonlyArray<A>>
} = () => S.make ([], [])

export const Compactable: C.Compactable<ReadonlyArrayHKT> = {
  compact: flatMap (O.match (constEmptyArray, of)),
  compactResults: successes,
  separate: reduce (getInitialSeparated (), (b, ma) =>
    R.match (
      ma,
      e => S.make (pipe (b, S.left, append (e)), S.right (b)),
      a => S.make (S.left (b), pipe (b, S.right, append (a), fromNonEmpty)),
    ),
  ),
}

export const compact: {
  <A>(self: ReadonlyArray<O.Option<A>>): ReadonlyArray<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: ReadonlyArray<R.Result<unknown, A>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: ReadonlyArray<R.Result<E, A>>,
  ): S.Separated<ReadonlyArray<E>, ReadonlyArray<A>>
} = Compactable.separate
