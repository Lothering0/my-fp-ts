import * as Order from '../../typeclasses/Order'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'

/** Time complexity: O(1) */
export const head: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at(0)!

/** Time complexity: O(n) */
export const init: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice(0, -1)

/** Time complexity: O(1) */
export const last: {
  <A>(as: NonEmptyReadonlyArray<A>): A
} = as => as.at(-1)!

/** Time complexity: O(n) */
export const tail: {
  <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A>
} = as => as.slice(1)

/** Time complexity: O(n) */
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

/** Time complexity: O(n) */
export const reverse = <A>(
  self: NonEmptyReadonlyArray<A>,
): NonEmptyReadonlyArray<A> =>
  self.toReversed() as unknown as NonEmptyReadonlyArray<A>

/** Time complexity: O(n log n) */
export const sort =
  <B>(Order: Order.Order<B>) =>
  <A extends B>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> =>
    self.toSorted((x, y) =>
      Order.compare(y)(x),
    ) as unknown as NonEmptyReadonlyArray<A>

/** Time complexity: O(n log n) */
export const sortBy: {
  <B>(
    orders: Iterable<Order.Order<B>>,
  ): <A extends B>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>
} = orders => self => [...orders].reduce((out, Ord) => sort(Ord)(out), self)

/** Time complexity: O(n) */
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
