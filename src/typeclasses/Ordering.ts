import * as eq from "./Eq"
import * as semigroup from "./Semigroup"
import * as monoid from "./Monoid"
import * as matching from "../modules/Matching"
import { constant } from "../utils/constant"
import { flow } from "../utils/flow"

export type Ordering = -1 | 0 | 1

export const match: {
  <A, B = A, C = B>(
    onLessThan: (e: -1) => A,
    onEqual: (e: 0) => B,
    onMoreThan: (e: 1) => C,
  ): (self: Ordering) => A | B | C
} = (onLessThan, onEqual, onMoreThan) =>
  flow (
    matching.match,
    matching.when (-1, onLessThan),
    matching.when (1, onMoreThan),
    matching.getOrElse (() => onEqual (0)),
  )

export const reverse: {
  (self: Ordering): Ordering
} = match (constant (1), constant (0), constant (-1))

export const fromNumber: {
  (n: number): Ordering
} = flow (
  matching.match,
  matching.on (n => n <= -1, constant<Ordering> (-1)),
  matching.on (n => n >= 1, constant<Ordering> (1)),
  matching.getOrElse (constant<Ordering> (0)),
)

export const Eq: eq.Eq<Ordering> = eq.EqStrict

export const equals = Eq.equals

export const Semigroup: semigroup.Semigroup<Ordering> = {
  combine: y => x => y === 0 ? x : y,
}

export const Monoid: monoid.Monoid<Ordering> = {
  ...Semigroup,
  empty: 0,
}
