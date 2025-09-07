import * as ordering from "./Ordering"
import * as contravariant from "./Contravariant"
import * as boolean from "../modules/Boolean"
import { flow, pipe } from "../utils/flow"
import { Hkt } from "./Hkt"
import { constant } from "../utils/constant"
import { Endomorphism } from "./Endomorphism"
import { Predicate } from "../modules/Predicate"
import { Semigroup } from "./Semigroup"
import { identity } from "../modules/Identity"
import { Monoid } from "./Monoid"

export interface OrdHkt extends Hkt {
  readonly type: Ord<this["_in"]>
}

export interface Ord<A> {
  readonly compare: (y: A) => (x: A) => ordering.Ordering
}

export const reverse: {
  <A>(Ord: Ord<A>): Ord<A>
} = Ord => ({
  compare: y => flow (Ord.compare (y), ordering.reverse),
})

export const equals: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => boolean
} = Ord => y => x => Ord.compare (y) (x) === 0

export const lessThan: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => boolean
} = Ord => y => x => Ord.compare (y) (x) === -1

export const lessThanOrEquals: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => boolean
} = Ord => y => x => Ord.compare (y) (x) <= 0

export const moreThan: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => boolean
} = Ord => y => x => Ord.compare (y) (x) === 1

export const moreThanOrEquals: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => boolean
} = Ord => y => x => Ord.compare (y) (x) >= 0

export const min: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => A
} = Ord => y => x =>
  pipe (x, Ord.compare (y), ordering.match (constant (x), constant (x), constant (y)))

export const max: {
  <A>(Ord: Ord<A>): (y: A) => (x: A) => A
} = Ord => y => x =>
  pipe (x, Ord.compare (y), ordering.match (constant (y), constant (x), constant (x)))

export const clamp: {
  <A>(Ord: Ord<A>): (low: A, high: A) => Endomorphism<A>
} = Ord => (low, high) => flow (min (Ord) (high), max (Ord) (low))

export const between: {
  <A>(Ord: Ord<A>): (low: A, high: A) => Predicate<A>
} = Ord => (low, high) => a =>
  pipe (
    a,
    moreThanOrEquals (Ord) (low),
    boolean.and (pipe (a, lessThanOrEquals (Ord) (high))),
  )

export const Contravariant: contravariant.Contravariant<OrdHkt> = {
  contramap: ba => Ord => ({
    compare: y => x => Ord.compare (ba (y)) (ba (x)),
  }),
}

export const { contramap } = Contravariant

/** Returns `Semigroup` which orders elements by first `Ord` and if the result is zero orders by second */
export const getSemigroup: {
  <A>(): Semigroup<Ord<A>>
} = () => ({
  combine: ordY => ordX => ({
    compare: y => x =>
      pipe (
        x,
        ordX.compare (y),
        ordering.match (identity, () => ordY.compare (y) (x), identity),
      ),
  }),
})

/** Returns `Monoid` which orders elements by first `Ord` and if the result is zero orders by second */
export const getMonoid: {
  <A>(): Monoid<Ord<A>>
} = () => ({
  ...getSemigroup (),
  empty: {
    compare: () => constant (0),
  },
})
