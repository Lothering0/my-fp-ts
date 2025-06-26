import * as NEA from "../../NonEmptyArray"
import { overload } from "../../../utils/overloads"
import { LazyArg } from "../../../types/utils"
import { isNonEmpty } from "."

interface MatchPointed {
  <A, B>(
    as: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): B
}

interface MatchPointFree {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (as: A[]) => B
}

interface Match extends MatchPointed, MatchPointFree {}

const matchPointed: MatchPointed = (as, whenEmpty, whenNonEmpty) =>
  isNonEmpty (as) ? whenNonEmpty (as) : whenEmpty ()

export const match: Match = overload (2, matchPointed)

interface MatchLeftPointed {
  <A, B>(
    as: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (head: A, tail: A[]) => B,
  ): B
}

interface MatchLeftPointFree {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (as: A[]) => B
}

interface MatchLeft extends MatchLeftPointed, MatchLeftPointFree {}

const matchLeftPointed: MatchLeftPointed = (as, whenEmpty, whenNonEmpty) =>
  isNonEmpty (as) ? whenNonEmpty (NEA.head (as), NEA.tail (as)) : whenEmpty ()

export const matchLeft: MatchLeft = overload (2, matchLeftPointed)

interface MatchRightPointed {
  <A, B>(
    as: A[],
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (init: A[], last: A) => B,
  ): B
}

interface MatchRightPointFree {
  <A, B>(
    whenEmpty: LazyArg<B>,
    whenNonEmpty: (as: NEA.NonEmptyArray<A>) => B,
  ): (init: A[], last: A) => B
}

interface MatchRight extends MatchRightPointed, MatchRightPointFree {}

const matchRightPointed: MatchRightPointed = (as, whenEmpty, whenNonEmpty) =>
  isNonEmpty (as) ? whenNonEmpty (NEA.init (as), NEA.last (as)) : whenEmpty ()

export const matchRight: MatchRight = overload (2, matchRightPointed)
