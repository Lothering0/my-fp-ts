import * as option from "../Option"
import * as readonlyArray from "../ReadonlyArray"
import * as boolean from "../Boolean"
import * as identity from "../Identity"
import * as eq from "../../types/Eq"
import { flow, pipe } from "../../utils/flow"
import { ReadonlyRecord } from "./readonly-record"
import { Refinement, TheseOrAnyString } from "../../types/utils"
import { Predicate } from "../Predicate"

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
  <K extends string, A>(entries: ReadonlyArray<[K, A]>): ReadonlyRecord<K, A>
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
    boolean.match (option.zero, () => option.some (self[k as keyof typeof self])),
  )

export const copy: {
  <K extends string, A>(self: ReadonlyRecord<K, A>): ReadonlyRecord<K, A>
} = self => ({ ...self })

export const deleteAt: {
  <K1 extends string, K2 extends TheseOrAnyString<K1>, A>(
    k: K2,
  ): (
    self: ReadonlyRecord<K1, A>,
  ) => ReadonlyRecord<K1 extends typeof k ? Exclude<K1, K2> : K1, A>
} = k => self =>
  pipe (
    identity.Do,
    identity.apS ("copy", copy (self)),
    identity.tapSync (
      ({ copy }) =>
        () =>
          delete copy[k as string as keyof typeof copy],
    ),
    identity.map (({ copy }) => copy),
  )

/** Is `a` element of a record by `Eq` instance */
export const elem =
  <A>(
    Eq: eq.Eq<A>,
  ): {
    (a: A): (self: ReadonlyRecord<string, A>) => boolean
  } =>
  a =>
    flow (values, readonlyArray.elem (Eq) (a))

export const every: {
  <A, B extends A>(
    p: Refinement<A, B>,
  ): Refinement<ReadonlyRecord<string, A>, ReadonlyRecord<string, B>>
  <A>(p: Predicate<A>): Predicate<ReadonlyRecord<string, A>>
} = (<A>(p: Predicate<A>) =>
  flow (values, readonlyArray.every (p))) as typeof every

export const everyWithIndex: {
  <K extends string, A>(
    p: (k: K, a: A) => boolean,
  ): Predicate<ReadonlyRecord<K, A>>
  <A>(p: (k: string, a: A) => boolean): Predicate<ReadonlyRecord<string, A>>
} = <A>(
  p: (k: string, a: A) => boolean,
): Predicate<ReadonlyRecord<string, A>> =>
  flow (
    toEntries,
    readonlyArray.every (([k, a]) => p (k, a)),
  )

export const exists: {
  <A>(p: Predicate<A>): Predicate<ReadonlyRecord<string, A>>
} = p => flow (values, readonlyArray.exists (p))

/** Alias for `exists` */
export const some = exists

export const existsWithIndex: {
  <K extends string, A>(
    p: (k: K, a: A) => boolean,
  ): Predicate<ReadonlyRecord<K, A>>
  <A>(p: (k: string, a: A) => boolean): Predicate<ReadonlyRecord<string, A>>
} = <A>(
  p: (k: string, a: A) => boolean,
): Predicate<ReadonlyRecord<string, A>> =>
  flow (
    toEntries,
    readonlyArray.exists (([k, a]) => p (k, a)),
  )

/** Alias for `existsWithIndex` */
export const someWithIndex = existsWithIndex
