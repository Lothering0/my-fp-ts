import * as Equivalence_ from '../typeclasses/Equivalence'
import * as Semigroup_ from '../typeclasses/Semigroup'
import * as Monoid_ from '../typeclasses/Monoid'
import * as Matching from '../modules/Matching'
import { constant } from '../utils/constant'
import { flow } from '../utils/flow'

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
  flow(
    Matching.match,
    Matching.when(-1, matchers.onLessThan),
    Matching.when(1, matchers.onMoreThan),
    Matching.getOrElse(() => matchers.onEqual(0)),
  )

export const reverse: {
  (self: Ordering): Ordering
} = match({
  onLessThan: constant(1),
  onEqual: constant(0),
  onMoreThan: constant(-1),
})

export const fromNumber: {
  (n: number): Ordering
} = flow(
  Matching.match,
  Matching.on(n => n <= -1, constant<Ordering>(-1)),
  Matching.on(n => n >= 1, constant<Ordering>(1)),
  Matching.getOrElse(constant<Ordering>(0)),
)

export const Equivalence: Equivalence_.Equivalence<Ordering> =
  Equivalence_.EquivalenceStrict

export const { equals } = Equivalence

export const OrderingSemigroup: Semigroup_.Semigroup<Ordering> = {
  combine: y => x => (y === 0 ? x : y),
}

export const OrderingMonoid: Monoid_.Monoid<Ordering> = {
  ...OrderingSemigroup,
  empty: 0,
}
