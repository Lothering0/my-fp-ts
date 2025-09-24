import * as readonlyArray from "./ReadonlyArray"
import * as option from "./Option"
import * as result from "./Result"
import * as boolean from "./Boolean"
import * as equivalence from "../typeclasses/Equivalence"
import * as predicate from "./Predicate"
import * as schema from "./Schema"
import { flow, pipe } from "../utils/flow"
import { Refinement } from "./Refinement"

export interface Matching<E, A> {
  readonly Equivalence: equivalence.Equivalence<E>
  readonly patterns: ReadonlyArray<[predicate.Predicate<E>, (e: E) => A]>
  readonly value: E
}

export const match: {
  <E>(value: E): Matching<E, never>
} = value => ({
  Equivalence: equivalence.EquivalenceStrict,
  patterns: [],
  value,
})

export const matchEquivalence: {
  <E>(Equivalence: equivalence.Equivalence<E>): (value: E) => Matching<E, never>
} = Equivalence => value => ({
  Equivalence,
  patterns: [],
  value,
})

export const on: {
  <E, D extends E, A>(
    p: Refinement<E, D>,
    da: (d: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
  <E, A>(
    p: predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} =
  <E, A>(p: predicate.Predicate<E>, ea: (e: E) => A) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.patterns,
      readonlyArray.append ([p, ea as (e: E) => A | B]),
    ),
  })

export const onNot: {
  <E, A>(
    p: predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (p, ea) => on (predicate.not (p), ea)

export const whenEquals: {
  <E, D extends E, A>(
    Equivalence: equivalence.Equivalence<E>,
    pattern: D,
    da: (d: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Equivalence, pattern, da) => on (Equivalence.equals (pattern), da)

export const whenNotEquals =
  <E, const D extends E, A>(
    Equivalence: equivalence.Equivalence<E>,
    pattern: D,
    ea: (e: Exclude<E, D>) => A,
  ) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    whenEquals (
      equivalence.reverse (Equivalence),
      pattern as Exclude<E, D>,
      ea,
    ) (self)

export const when: {
  <E, const D extends E, A>(
    pattern: D,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (pattern, ea) => self => whenEquals (self.Equivalence, pattern, ea) (self)

export const whenNot =
  <E, const D extends E, A>(pattern: D, ea: (e: Exclude<E, D>) => A) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    pipe (
      self,
      whenEquals (
        equivalence.reverse (self.Equivalence),
        pattern as Exclude<E, D>,
        ea,
      ),
    )

export const whenInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) => on (e => e instanceof constructor, ea)

export const whenNotInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: Exclude<E, D>) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) =>
  on (e => pipe (e instanceof constructor, boolean.not), ea)

export const whenSchema: {
  <E, D extends E, A>(
    Schema: schema.Schema<D>,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => on (schema.validate (Schema), ea)

export const whenNotSchema: {
  <E, D extends E, A>(
    Schema: schema.Schema<D>,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => onNot (schema.validate (Schema), ea)

export const getResult: {
  <E, A>(self: Matching<E, A>): result.Result<E, A>
} = self =>
  pipe (
    self.patterns,
    readonlyArray.find (([p]) => p (self.value)),
    option.match ({
      onNone: () => result.fail (self.value),
      onSome: ([, f]) => pipe (self.value, f, result.succeed),
    }),
  )

export const getOption: {
  <E, A>(self: Matching<E, A>): option.Option<A>
} = flow (getResult, option.fromResult)

export const getOrElse: {
  <E, A>(onDefault: (e: E) => A): <B>(self: Matching<E, B>) => A | B
} = onDefault => flow (getResult, result.getOrElse (onDefault))

export const getResults: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<result.Result<E, A>>
} = self =>
  pipe (
    self.patterns,
    readonlyArray.map (([p, f]) =>
      pipe (
        self.value,
        p,
        boolean.match ({
          onFalse: () => result.fail (self.value),
          onTrue: () => pipe (self.value, f, result.succeed),
        }),
      ),
    ),
  )

export const getFailures: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<E>
} = flow (getResults, readonlyArray.failures)

export const getSuccesses: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<A>
} = flow (getResults, readonlyArray.successes)

export const getOptions: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<option.Option<A>>
} = flow (getResults, readonlyArray.map (option.fromResult))

export const getOrElseAll: {
  <E, A>(
    onDefault: (e: E) => A,
  ): <B>(self: Matching<E, B>) => ReadonlyArray<A | B>
} = onDefault =>
  flow (getResults, readonlyArray.map (result.getOrElse (onDefault)))
