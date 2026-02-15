import * as Option from '../Option'
import * as Array from '../ReadonlyArray'
import * as Iterable from '../Iterable'
import * as Boolean from '../Boolean'
import * as Equivalence from '../../typeclasses/Equivalence'
import * as Order_ from '../../typeclasses/Order'
import { flow, pipe } from '../../utils/flow'
import { ReadonlyRecord } from './readonly-record'
import { TheseOrAnyString } from '../../types/utils'
import { Predicate, PredicateWithIndex } from '../Predicate'
import { Refinement, RefinementWithIndex } from '../Refinement'
import { Magma } from '../../typeclasses/Magma'
import { map } from './functor'
import { Endomorphism } from '../../typeclasses/Endomorphism'
import { constant } from '../../utils/constant'

export const keys: {
  <K extends string, A>(record: ReadonlyRecord<K, A>): ReadonlyArray<K>
} = Object.keys

export const values: {
  <K extends string, A>(record: ReadonlyRecord<K, A>): ReadonlyArray<A>
} = Object.values

export const toEntries: {
  <K extends string, A>(
    record: ReadonlyRecord<K, A>,
  ): ReadonlyArray<readonly [K, A]>
} = Object.entries

export const fromEntries: {
  <K extends string, A>(
    entries: Iterable<readonly [K, A]>,
  ): ReadonlyRecord<K, A>
} = Object.fromEntries

export const isEmpty = (
  record: ReadonlyRecord<string, unknown>,
): record is ReadonlyRecord<never, never> => pipe(record, keys, Array.isEmpty)

export const has: {
  (k: string): (record: ReadonlyRecord<string, unknown>) => boolean
} = k => record => k in record

export const lookup: {
  <K extends string, A>(
    k: TheseOrAnyString<NoInfer<K>>,
  ): (record: ReadonlyRecord<K, A>) => Option.Option<A>
} = k => record =>
  pipe(
    record,
    has(k),
    Boolean.match({
      onFalse: Option.none,
      onTrue: () => Option.some(record[k as keyof typeof record]),
    }),
  )

export const fromIterable: {
  <A>(iterable: Iterable<A>): ReadonlyRecord<string, A>
} = record => ({ ...record })

/** Is `a` element of a record by `Equivalence` instance */
export const elem =
  <A>(
    Equivalence: Equivalence.Equivalence<A>,
  ): {
    (a: A): (record: ReadonlyRecord<string, A>) => boolean
  } =>
  a =>
    flow(values, Array.elem(Equivalence)(a))

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
  flow(
    toEntries,
    Array.every(([k, a]) => p(a, k)),
  )) as typeof every

export const exists: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): Predicate<ReadonlyRecord<K, A>>
} = p =>
  flow(
    toEntries,
    Array.exists(([k, a]) => p(a, k)),
  )

/** Alias for `exists` */
export const some = exists

export const find: {
  <A, K extends string>(
    p: PredicateWithIndex<A, K>,
  ): (record: ReadonlyRecord<K, A>) => Option.Option<A>
} = p =>
  flow(
    toEntries,
    Array.find(([k, a]) => p(a, k)),
    Option.map(([, a]) => a),
  )

export const findMap: {
  <A, B, K extends string>(
    p: (a: A, k: K) => Option.Option<B>,
  ): (record: ReadonlyRecord<K, A>) => Option.Option<B>
} = p =>
  flow(
    toEntries,
    Array.findMap(([k, a]) => p(a, k)),
  )

export const prepend: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = (k, a) => record => ({ [k]: a, ...record })

export const append: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = (k, a) => record => ({ ...record, [k]: a })

export const concat: {
  <A, K1 extends string>(
    record: ReadonlyRecord<K1, A>,
  ): <B, K2 extends string>(
    selfRecord: ReadonlyRecord<K2, B>,
  ) => ReadonlyRecord<K1 | K2, A | B>
} = record => selfRecord => ({ ...selfRecord, ...record })

export const getUnion: {
  <A>(
    Magma: Magma<A>,
  ): <K1 extends string>(
    record: ReadonlyRecord<K1, A>,
  ) => <K2 extends string>(
    selfRecord: ReadonlyRecord<K2, A>,
  ) => ReadonlyRecord<K1 | K2, A>
} = Magma => record => selfRecord =>
  pipe(
    record,
    concat(selfRecord),
    map((a, k) =>
      pipe(
        record,
        has(k),
        Boolean.and(has(k)(selfRecord)),
        Boolean.match({
          onFalse: () => a,
          onTrue: () =>
            Magma.combine(record[k as keyof typeof record])(
              selfRecord[k as keyof typeof selfRecord],
            ),
        }),
      ),
    ),
  )

export const omit: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    ...keys: ReadonlyArray<K>
  ): (record: A) => Omit<A, (typeof keys)[number]>
} =
  (...keys) =>
  record => {
    const copied = { ...record }
    keys.forEach(key => {
      delete copied[key as keyof typeof copied]
    })
    return copied
  }

export const pick: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    ...keys: ReadonlyArray<K>
  ): (record: A) => Pick<A, (typeof keys)[number]>
} =
  (...keys) =>
  record => {
    const copied = { ...record }
    for (const key in copied) {
      if (!keys.includes(key as unknown as (typeof keys)[number])) {
        delete copied[key as keyof typeof copied]
      }
    }
    return copied
  }

export const upsertAt: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = append

export const modifyAt: {
  <A, K extends string>(
    k: K,
    f: Endomorphism<A>,
  ): (record: ReadonlyRecord<K, A>) => Option.Option<ReadonlyRecord<K, A>>
} = (k, f) => record =>
  pipe(
    record,
    lookup(k),
    Option.map(a => ({ ...record, [k]: f(a) })),
  )

export const updateAt: {
  <A, K extends string>(
    k: K,
    a: A,
  ): (record: ReadonlyRecord<K, A>) => Option.Option<ReadonlyRecord<K, A>>
} = (k, a) => modifyAt(k, constant(a))

export const removeAt: {
  <A extends ReadonlyRecord<string, unknown>, K extends keyof A>(
    key: K,
  ): (record: A) => Omit<A, typeof key>
} = k => omit(k)

export const sortValues: {
  <B>(
    Order: Order_.Order<B>,
  ): <A extends B, K extends string>(
    record: ReadonlyRecord<K, A>,
  ) => ReadonlyRecord<K, A>
} = Order =>
  flow(
    toEntries,
    Array.sort(
      pipe(
        Order,
        Order_.contramap(([, a]: readonly [string, any]) => a),
      ),
    ),
    fromEntries,
  )

export const sortValuesBy: {
  <B>(
    orders: Iterable<Order_.Order<B>>,
  ): <A extends B, K extends string>(
    record: ReadonlyRecord<K, A>,
  ) => ReadonlyRecord<K, A>
} = orders =>
  flow(
    toEntries,
    Array.sortBy(
      pipe(
        orders,
        Iterable.map(Order_.contramap(([, a]: readonly [string, any]) => a)),
      ),
    ),
    fromEntries,
  )

export const sortKeys: {
  (
    Order: Order_.Order<string>,
  ): <A, K extends string>(record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = Order =>
  flow(
    toEntries,
    Array.sort(
      pipe(
        Order,
        Order_.contramap(([k]: readonly [string, any]) => k),
      ),
    ),
    fromEntries,
  )

export const sortKeysBy: {
  (
    orders: Iterable<Order_.Order<string>>,
  ): <A, K extends string>(record: ReadonlyRecord<K, A>) => ReadonlyRecord<K, A>
} = orders =>
  flow(
    toEntries,
    Array.sortBy(
      pipe(
        orders,
        Iterable.map(Order_.contramap(([k]: readonly [string, any]) => k)),
      ),
    ),
    fromEntries,
  )
