import * as readonlyArray from "./ReadonlyArray"
import * as option from "./Option"
import * as result from "./Result"
import * as boolean from "./Boolean"
import * as eq from "../typeclasses/Eq"
import * as predicate from "./Predicate"
import { flow, pipe } from "../utils/flow"
import { Refinement } from "./Refinement"

export interface Matching<E, A> {
  readonly Eq: eq.Eq<E>
  readonly patterns: ReadonlyArray<[predicate.Predicate<E>, (e: E) => A]>
  readonly value: E
}

export const match: {
  <E>(value: E): Matching<E, never>
} = value => ({
  Eq: eq.EqStrict,
  patterns: [],
  value,
})

export const matchEq: {
  <E>(Eq: eq.Eq<E>): (value: E) => Matching<E, never>
} = Eq => value => ({
  Eq,
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
    Eq: eq.Eq<E>,
    pattern: D,
    da: (d: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Eq, pattern, da) => on (Eq.equals (pattern), da)

export const whenNotEquals =
  <E, const D extends E, A>(
    Eq: eq.Eq<E>,
    pattern: D,
    ea: (e: Exclude<E, D>) => A,
  ) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    whenEquals (eq.reverse (Eq), pattern as Exclude<E, D>, ea) (self)

export const when: {
  <E, const D extends E, A>(
    pattern: D,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (pattern, ea) => self => whenEquals (self.Eq, pattern, ea) (self)

export const whenNot =
  <E, const D extends E, A>(pattern: D, ea: (e: Exclude<E, D>) => A) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    whenEquals (eq.reverse (self.Eq), pattern as Exclude<E, D>, ea) (self)

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

export const getResult: {
  <E, A>(self: Matching<E, A>): result.Result<E, A>
} = self =>
  pipe (
    self.patterns,
    readonlyArray.find (([p]) => p (self.value)),
    option.match (
      () => result.fail (self.value),
      ([, f]) => pipe (self.value, f, result.succeed),
    ),
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
        boolean.match (
          () => result.fail (self.value),
          () => pipe (self.value, f, result.succeed),
        ),
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
