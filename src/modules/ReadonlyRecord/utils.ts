import * as option from "../Option"
import * as readonlyArray from "../ReadonlyArray"
import * as iterable from "../Iterable"
import * as boolean from "../Boolean"
import * as equivalence from "../../typeclasses/Equivalence"
import * as order from "../../typeclasses/Order"
import { flow, pipe } from "../../utils/flow"
import { ReadonlyRecord } from "./readonly-record"
import { TheseOrAnyString } from "../../types/utils"
import { Predicate, PredicateWithIndex } from "../Predicate"
import { Refinement, RefinementWithIndex } from "../Refinement"
import { Magma } from "../../typeclasses/Magma"
import { map } from "./functor"
import { Endomorphism } from "../../typeclasses/Endomorphism"
import { constant } from "../../utils/constant"

export const keys: {
  <K extends string, A>(self: ReadonlyRecord<K, A>): ReadonlyArray<K>
} = Object.keys

export const values: {
  <K extends string, A>(self: ReadonlyRecord<K, A>): ReadonlyArray<A>
} = Object.values

export const toEntries: {
  <K extends string, A>(self: ReadonlyRecord<K, A>): ReadonlyArray<[K, A]>
} = Object.entries

export const fromEntries: {
  <K extends string, A>(
    entries: Iterable<readonly [K, A]>,
  ): ReadonlyRecord<K, A>
} = Object.fromEntries

export const isEmpty = (
  self: ReadonlyRecord<string, unknown>,
): self is ReadonlyRecord<never, never> =>
  pipe (self, keys, readonlyArray.isEmpty)

export const has: {
  (k: string): (self: ReadonlyRecord<string, unknown>) => boolean
} = k => self => k in self

export const lookup: {
  <K extends string, A>(
    k: TheseOrAnyString<NoInfer<K>>,
  ): (self: ReadonlyRecord<K, A>) => option.Option<A>
} = k => self =>
  pipe (
    self,
    has (k),
    boolean.match ({
      onFalse: option.zero,
      onTrue: () => option.some (self[k as keyof typeof self]),
    }),
  )

export const copy: {
  <K extends string, A>(self: ReadonlyRecord<K, A>): ReadonlyRecord<K, A>
} = self => ({ ...self })

/** Is `a` element of a record by `Equivalence` instance */
export const elem =
  <A>(
    Equivalence: equivalence.Equivalence<A>,
  ): {
    (a: A): (self: ReadonlyRecord<string, A>) => boolean
  } =>
  a =>
    flow (values, readonlyArray.elem (Equivalence) (a))

export const every: {
  <A, B extends A, K extends string>(
    p: RefinementWithIndex<A, B, K>,
  ): Refinement<ReadonlyRecord<K, A>, ReadonlyRecord<K, B>>
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): Predicate<ReadonlyRecord<K, A>>
} = (<A, K extends string>(
  p: PredicateWithIndex<A, K>,
): Predicate<ReadonlyRecord<K, A>> =>
  flow (
    toEntries,
    readonlyArray.every (([k, a]) => p (a, k)),
  )) as typeof every

export const exists: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): Predicate<ReadonlyRecord<K, A>>
} = p =>
  flow (
    toEntries,
    readonlyArray.exists (([k, a]) => p (a, k)),
  )

/** Alias for `exists` */
export const some = exists

export const find: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): (self: ReadonlyRecord<K, A>) => option.Option<A>
} = p =>
  flow (
    toEntries,
    readonlyArray.find (([k, a]) => p (a, k)),
    option.map (([, a]) => a),
  )

export const findMap: {
  <A, B, K extends string>(
    p: (a: A, k: K) => option.Option<B>,
  ): (self: ReadonlyRecord<K, A>) => option.Option<B>
} = p =>
  flow (
    toEntries,
    readonlyArray.findMap (([k, a]) => p (a, k)),
  )

export const prepend: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = (k, a) => self => ({ [k]: a, ...self })

export const append: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = (k, a) => self => ({ ...self, [k]: a })

export const concat: {
  <A, K1 extends string>(
    a: ReadonlyRecord<K1, A>,
  ): <B, K2 extends string>(
    self: ReadonlyRecord<K2, B>,
  ) => ReadonlyRecord<K1 | K2, A | B>
} = a => self => ({ ...self, ...a })

export const getUnion: {
  <A>(
    Magma: Magma<A>,
  ): <K1 extends string>(
    as: ReadonlyRecord<K1, A>,
  ) => <K2 extends string>(
    self: ReadonlyRecord<K2, A>,
  ) => ReadonlyRecord<K1 | K2, A>
} = Magma => as => self =>
  pipe (
    as,
    concat (self),
    map ((a, k) =>
      pipe (
        as,
        has (k),
        boolean.and (has (k) (self)),
        boolean.match ({
          onFalse: () => a,
          onTrue: () =>
            Magma.combine (as[k as keyof typeof as]) (
              self[k as keyof typeof self],
            ),
        }),
      ),
    ),
  )

export const omit: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    ...keys: ReadonlyArray<K>
  ): (self: A) => Omit<A, (typeof keys)[number]>
} =
  (...keys) =>
  self => {
    const copied = { ...self }
    keys.forEach (key => {
      delete copied[key as keyof typeof copied]
    })
    return copied
  }

export const pick: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    ...keys: ReadonlyArray<K>
  ): (self: A) => Pick<A, (typeof keys)[number]>
} =
  (...keys) =>
  self => {
    const copied = { ...self }
    for (const key in copied) {
      if (!keys.includes (key as unknown as (typeof keys)[number])) {
        delete copied[key as keyof typeof copied]
      }
    }
    return copied
  }

export const upsertAt: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = append

export const modifyAt: {
  <A, K extends string>(
    k: K,
    f: Endomorphism<A>,
  ): (self: ReadonlyRecord<K, A>) => option.Option<ReadonlyRecord<K, A>>
} = (k, f) => self =>
  pipe (
    self,
    lookup (k),
    option.map (a => ({ ...self, [k]: f (a) })),
  )

export const updateAt: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (self: ReadonlyRecord<K, A>) => option.Option<ReadonlyRecord<K, A>>
} = (k, a) => modifyAt (k, constant (a))

export const removeAt: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    key: K,
  ): (self: A) => Omit<A, typeof key>
} = k => omit (k)

export const sortValues: {
  <B>(
    Order: order.Order<B>,
  ): <A extends B, K extends string>(
    self: ReadonlyRecord<K, A>,
  ) => ReadonlyRecord<K, A>
} = Order =>
  flow (
    toEntries,
    readonlyArray.sort (
      pipe (
        Order,
        order.contramap (([, a]) => a),
      ),
    ),
    fromEntries,
  )

export const sortValuesBy: {
  <B>(
    orders: Iterable<order.Order<B>>,
  ): <A extends B, K extends string>(
    self: ReadonlyRecord<K, A>,
  ) => ReadonlyRecord<K, A>
} = orders =>
  flow (
    toEntries,
    readonlyArray.sortBy (
      pipe (orders, iterable.map (order.contramap (([, a]) => a))),
    ),
    fromEntries,
  )

export const sortKeys: {
  (
    Order: order.Order<string>,
  ): <A, K extends string>(self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = Order =>
  flow (
    toEntries,
    readonlyArray.sort (
      pipe (
        Order,
        order.contramap (([k]) => k),
      ),
    ),
    fromEntries,
  )

export const sortKeysBy: {
  (
    orders: Iterable<order.Order<string>>,
  ): <A, K extends string>(self: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = orders =>
  flow (
    toEntries,
    readonlyArray.sortBy (
      pipe (orders, iterable.map (order.contramap (([k]) => k))),
    ),
    fromEntries,
  )
