import * as eq from "../typeclasses/Eq"
import * as semigroup from "../typeclasses/Semigroup"
import * as monoid from "../typeclasses/Monoid"
import * as matching from "../modules/Matching"
import { constant } from "../utils/constant"
import { flow } from "../utils/flow"

export type Ordering = -1 | 0 | 1

export interface OrderingMatchers<A, B, C> {
  readonly onLessThan: (e: -1) => A
  readonly onEqual: (e: 0) => B
  readonly onMoreThan: (e: 1) => C
}

export const match: {
  <A, B = A, C = B>(
    matchers: OrderingMatchers<A, B, C>,
  ): (self: Ordering) => A | B | C
} = matchers =>
  flow (
    matching.match,
    matching.when (-1, matchers.onLessThan),
    matching.when (1, matchers.onMoreThan),
    matching.getOrElse (() => matchers.onEqual (0)),
  )

export const reverse: {
  (self: Ordering): Ordering
} = match ({
  onLessThan: constant (1),
  onEqual: constant (0),
  onMoreThan: constant (-1),
})

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
