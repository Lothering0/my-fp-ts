import * as Ordering from '../modules/Ordering'
import * as Contravariant_ from './Contravariant'
import * as Boolean from '../modules/Boolean'
import { flow, pipe } from '../utils/flow'
import { Hkt as Hkt_ } from './Hkt'
import { constant } from '../utils/constant'
import { Endomorphism } from './Endomorphism'
import { Predicate } from '../modules/Predicate'
import { Semigroup } from './Semigroup'
import { identity } from '../modules/Identity'
import { Monoid } from './Monoid'

export interface Hkt extends Hkt_ {
  readonly Type: Order<this['Fixed']>
}

export interface Order<S> {
  readonly compare: (y: S) => (x: S) => Ordering.Ordering
}

export const reverse: {
  <S>(Order: Order<S>): Order<S>
} = Order => ({
  compare: y => flow(Order.compare(y), Ordering.reverse),
})

export const equals: {
  <S>(Order: Order<S>): (y: S) => (x: S) => boolean
} = Order => y => x => Order.compare(y)(x) === 0

export const lessThan: {
  <S>(Order: Order<S>): (y: S) => (x: S) => boolean
} = Order => y => x => Order.compare(y)(x) === -1

export const lessThanOrEquals: {
  <S>(Order: Order<S>): (y: S) => (x: S) => boolean
} = Order => y => x => Order.compare(y)(x) <= 0

export const moreThan: {
  <S>(Order: Order<S>): (y: S) => (x: S) => boolean
} = Order => y => x => Order.compare(y)(x) === 1

export const moreThanOrEquals: {
  <S>(Order: Order<S>): (y: S) => (x: S) => boolean
} = Order => y => x => Order.compare(y)(x) >= 0

export const min: {
  <S>(Order: Order<S>): (y: S) => (x: S) => S
} = Order => y => x =>
  pipe(
    x,
    Order.compare(y),
    Ordering.match({
      onLessThan: constant(x),
      onEqual: constant(x),
      onMoreThan: constant(y),
    }),
  )

export const max: {
  <S>(Order: Order<S>): (y: S) => (x: S) => S
} = Order => y => x =>
  pipe(
    x,
    Order.compare(y),
    Ordering.match({
      onLessThan: constant(y),
      onEqual: constant(x),
      onMoreThan: constant(x),
    }),
  )

export const clamp: {
  <S>(Order: Order<S>): (low: S, high: S) => Endomorphism<S>
} = Order => (low, high) => flow(min(Order)(high), max(Order)(low))

export const between: {
  <S>(Order: Order<S>): (low: S, high: S) => Predicate<S>
} = Order => (low, high) => a =>
  pipe(
    a,
    moreThanOrEquals(Order)(low),
    Boolean.and(pipe(a, lessThanOrEquals(Order)(high))),
  )

export const Contravariant: Contravariant_.Contravariant<Hkt> = {
  contramap: ts => Order => ({
    compare: y => x => Order.compare(ts(y))(ts(x)),
  }),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): (self: Order<S>) => Order<T>
} = Contravariant.contramap

/** Returns `Semigroup` which orders elements by first `Order` and if the result is zero orders by second */
export const getOrderSemigroup: {
  <S>(): Semigroup<Order<S>>
} = () => ({
  combine: ordY => ordX => ({
    compare: y => x =>
      pipe(
        x,
        ordX.compare(y),
        Ordering.match({
          onLessThan: identity,
          onEqual: () => ordY.compare(y)(x),
          onMoreThan: identity,
        }),
      ),
  }),
})

/** Returns `Monoid` which orders elements by first `Order` and if the result is zero orders by second */
export const getOrderMonoid: {
  <S>(): Monoid<Order<S>>
} = () => ({
  ...getOrderSemigroup(),
  empty: {
    compare: () => constant(0),
  },
})
