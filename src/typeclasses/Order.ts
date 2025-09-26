import * as ordering from "../modules/Ordering"
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

export interface OrderHkt extends Hkt {
  readonly Type: Order<this["In"]>
}

export interface Order<A> {
  readonly compare: (y: A) => (x: A) => ordering.Ordering
}

export const reverse: {
  <A>(Order: Order<A>): Order<A>
} = Order => ({
  compare: y => flow (Order.compare (y), ordering.reverse),
})

export const equals: {
  <A>(Order: Order<A>): (y: A) => (x: A) => boolean
} = Order => y => x => Order.compare (y) (x) === 0

export const lessThan: {
  <A>(Order: Order<A>): (y: A) => (x: A) => boolean
} = Order => y => x => Order.compare (y) (x) === -1

export const lessThanOrEquals: {
  <A>(Order: Order<A>): (y: A) => (x: A) => boolean
} = Order => y => x => Order.compare (y) (x) <= 0

export const moreThan: {
  <A>(Order: Order<A>): (y: A) => (x: A) => boolean
} = Order => y => x => Order.compare (y) (x) === 1

export const moreThanOrEquals: {
  <A>(Order: Order<A>): (y: A) => (x: A) => boolean
} = Order => y => x => Order.compare (y) (x) >= 0

export const min: {
  <A>(Order: Order<A>): (y: A) => (x: A) => A
} = Order => y => x =>
  pipe (
    x,
    Order.compare (y),
    ordering.match ({
      onLessThan: constant (x),
      onEqual: constant (x),
      onMoreThan: constant (y),
    }),
  )

export const max: {
  <A>(Order: Order<A>): (y: A) => (x: A) => A
} = Order => y => x =>
  pipe (
    x,
    Order.compare (y),
    ordering.match ({
      onLessThan: constant (y),
      onEqual: constant (x),
      onMoreThan: constant (x),
    }),
  )

export const clamp: {
  <A>(Order: Order<A>): (low: A, high: A) => Endomorphism<A>
} = Order => (low, high) => flow (min (Order) (high), max (Order) (low))

export const between: {
  <A>(Order: Order<A>): (low: A, high: A) => Predicate<A>
} = Order => (low, high) => a =>
  pipe (
    a,
    moreThanOrEquals (Order) (low),
    boolean.and (pipe (a, lessThanOrEquals (Order) (high))),
  )

export const Contravariant: contravariant.Contravariant<OrderHkt> = {
  contramap: ba => Order => ({
    compare: y => x => Order.compare (ba (y)) (ba (x)),
  }),
}

export const { contramap } = Contravariant

/** Returns `Semigroup` which orders elements by first `Order` and if the result is zero orders by second */
export const getSemigroup: {
  <A>(): Semigroup<Order<A>>
} = () => ({
  combine: ordY => ordX => ({
    compare: y => x =>
      pipe (
        x,
        ordX.compare (y),
        ordering.match ({
          onLessThan: identity,
          onEqual: () => ordY.compare (y) (x),
          onMoreThan: identity,
        }),
      ),
  }),
})

/** Returns `Monoid` which orders elements by first `Order` and if the result is zero orders by second */
export const getMonoid: {
  <A>(): Monoid<Order<A>>
} = () => ({
  ...getSemigroup (),
  empty: {
    compare: () => constant (0),
  },
})
