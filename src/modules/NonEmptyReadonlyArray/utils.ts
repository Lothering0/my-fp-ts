import * as Order from '../../typeclasses/Order'
import { pipe } from '../../utils/flow'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'

export const head: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at(0)!

export const init: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice(0, -1)

export const last: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at(-1)!

export const tail: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice(1)

export const concat: {
  <A>(
    end: ReadonlyArray<A>,
  ): (start: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
  <A>(
    end: NonEmptyReadonlyArray<A>,
  ): (start: ReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = end => start =>
  start.concat(end) as [
    unknown,
    ...ReadonlyArray<unknown>,
  ] as NonEmptyReadonlyArray<unknown>

export const reverse = <A>(
  self: NonEmptyReadonlyArray<A>,
): NonEmptyReadonlyArray<A> =>
  self.toReversed() as unknown as NonEmptyReadonlyArray<A>

export const sort =
  <B>(Order: Order.Order<B>) =>
  <A extends B>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> =>
    self.toSorted((x, y) =>
      Order.compare(y)(x),
    ) as unknown as NonEmptyReadonlyArray<A>

export const sortBy: {
  <B>(
    orders: Iterable<Order.Order<B>>,
  ): <A extends B>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = orders => self => [...orders].reduce((out, Ord) => sort(Ord)(out), self)

export const flatDeep: {
  (depth: 0): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
  (
    depth: 1,
  ): <A>(
    self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 2,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 3,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>>
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 4,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>>
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 5,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<
          NonEmptyReadonlyArray<NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>>
        >
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 6,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<
          NonEmptyReadonlyArray<
            NonEmptyReadonlyArray<
              NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
            >
          >
        >
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 7,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<
          NonEmptyReadonlyArray<
            NonEmptyReadonlyArray<
              NonEmptyReadonlyArray<
                NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
              >
            >
          >
        >
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 8,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<
          NonEmptyReadonlyArray<
            NonEmptyReadonlyArray<
              NonEmptyReadonlyArray<
                NonEmptyReadonlyArray<
                  NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
                >
              >
            >
          >
        >
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: 9,
  ): <A>(
    self: NonEmptyReadonlyArray<
      NonEmptyReadonlyArray<
        NonEmptyReadonlyArray<
          NonEmptyReadonlyArray<
            NonEmptyReadonlyArray<
              NonEmptyReadonlyArray<
                NonEmptyReadonlyArray<
                  NonEmptyReadonlyArray<
                    NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
                  >
                >
              >
            >
          >
        >
      >
    >,
  ) => NonEmptyReadonlyArray<A>
  (
    depth: number,
  ): <A>(
    self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<unknown>>,
  ) => NonEmptyReadonlyArray<A>
} =
  (depth: number) =>
  <A>(self: NonEmptyReadonlyArray<unknown>) =>
    self.flat(depth) as unknown as NonEmptyReadonlyArray<A>
