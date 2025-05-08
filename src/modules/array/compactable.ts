import * as O from "../option"
import * as E from "../either"
import * as S from "../separated"
import { Compactable } from "../../types/Compactable"
import { bind } from "./monad"
import { reduce } from "./foldable"

const getInitialSeparated = <E, A>(): S.Separated<E[], A[]> => ({
  left: [],
  right: [],
})

export const compactable: Compactable<"Array"> = {
  _URI: "Array",
  compact: bind (a => O.isNone (a) ? [] : [O.fromSome (a)]),
  separate: reduce (getInitialSeparated (), (b, ma) =>
    E.either (
      ma,
      e => ({ left: [...S.left (b), e], right: S.right (b) }),
      a => ({ left: S.left (b), right: [...S.right (b), a] }),
    ),
  ),
}

export const { compact, separate } = compactable
