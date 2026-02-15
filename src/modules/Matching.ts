import * as Array from './ReadonlyArray'
import * as Option from './Option'
import * as Result from './Result'
import * as Boolean from './Boolean'
import * as Equivalence_ from '../typeclasses/Equivalence'
import * as Predicate from './Predicate'
import * as Schema_ from './Schema'
import { flow, pipe } from '../utils/flow'
import { Refinement } from './Refinement'
import { Tagged, Tag } from '../types/Tag'

export interface Matching<E, A> {
  readonly Equivalence: Equivalence_.Equivalence<E>
  readonly patterns: ReadonlyArray<[Predicate.Predicate<E>, (e: E) => A]>
  readonly value: E
}

export const match: {
  <E>(value: E): Matching<E, never>
} = value => ({
  Equivalence: Equivalence_.EquivalenceStrict,
  patterns: [],
  value,
})

export const matchEquivalence: {
  <E>(
    Equivalence: Equivalence_.Equivalence<E>,
  ): (value: E) => Matching<E, never>
} = Equivalence => value => ({
  Equivalence,
  patterns: [],
  value,
})

export const on: {
  <E, D extends E, A>(
    p: Refinement<E, D>,
    da: (d: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
  <E, A>(
    p: Predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} =
  <E, A>(p: Predicate.Predicate<E>, ea: (e: E) => A) =>
  <B>(matching: Matching<E, B>): Matching<E, A | B> => ({
    ...matching,
    patterns: pipe(matching.patterns, Array.append([p, ea as (e: E) => A | B])),
  })

export const onNot: {
  <E, A>(
    p: Predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (p, ea) => on(Predicate.not(p), ea)

export const whenEquals: {
  <E, D extends E, A>(
    Equivalence: Equivalence_.Equivalence<E>,
    pattern: D,
    da: (d: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (Equivalence, pattern, da) => on(Equivalence.equals(pattern), da)

export const whenNotEquals =
  <E, const D extends E, A>(
    Equivalence: Equivalence_.Equivalence<E>,
    pattern: D,
    ea: (e: Exclude<E, D>) => A,
  ) =>
  <B>(matching: Matching<E, B>): Matching<E, A | B> =>
    whenEquals(
      Equivalence_.reverse(Equivalence),
      pattern as Exclude<E, D>,
      ea,
    )(matching)

export const when: {
  <E, const D extends E, A>(
    pattern: D,
    ea: (e: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (pattern, ea) => matching =>
  whenEquals(matching.Equivalence, pattern, ea)(matching)

export const whenNot =
  <E, const D extends E, A>(pattern: D, ea: (e: Exclude<E, D>) => A) =>
  <B>(matching: Matching<E, B>): Matching<E, A | B> =>
    pipe(
      matching,
      whenEquals(
        Equivalence_.reverse(matching.Equivalence),
        pattern as Exclude<E, D>,
        ea,
      ),
    )

export const whenTag: {
  <E extends Tagged, A, T extends Tag<E>>(
    tag: T,
    // Passing to callback exactly tagged object
    ea: (e: E extends Tagged<T> ? E : never) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (tag, ea) => on(e => e._tag === tag, ea)

export const whenNotTag: {
  <E extends Tagged, A, T extends Tag<E>>(
    tag: T,
    // Passing to callback only those objects which is not tagged with provided tag
    ea: (e: E extends Tagged<T> ? never : E) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (tag, ea) => on(e => e._tag !== tag, ea)

export const whenInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) => on(e => e instanceof constructor, ea)

export const whenNotInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: Exclude<E, D>) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) =>
  on(e => pipe(e instanceof constructor, Boolean.not), ea)

export const whenSchema: {
  <E, D extends E, A>(
    Schema: Schema_.Schema<D>,
    ea: (e: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => on(Schema_.validate(Schema), ea)

export const whenNotSchema: {
  <E, D extends E, A>(
    Schema: Schema_.Schema<D>,
    ea: (e: D) => A,
  ): <B>(matching: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => onNot(Schema_.validate(Schema), ea)

export const getResult: {
  <E, A>(matching: Matching<E, A>): Result.Result<A, E>
} = matching =>
  pipe(
    matching.patterns,
    Array.find(([p]) => p(matching.value)),
    Option.match({
      onNone: () => Result.fail(matching.value),
      onSome: ([, f]) => pipe(matching.value, f, Result.succeed),
    }),
  )

export const getOption: {
  <E, A>(matching: Matching<E, A>): Option.Option<A>
} = flow(getResult, Option.fromResult)

export const getOrElse: {
  <E, A>(onDefault: (e: E) => A): <B>(matching: Matching<E, B>) => A | B
} = onDefault => flow(getResult, Result.getOrElse(onDefault))

export const getResults: {
  <E, A>(matching: Matching<E, A>): ReadonlyArray<Result.Result<A, E>>
} = matching =>
  pipe(
    matching.patterns,
    Array.map(([p, f]) =>
      pipe(
        matching.value,
        p,
        Boolean.match({
          onFalse: () => Result.fail(matching.value),
          onTrue: () => pipe(matching.value, f, Result.succeed),
        }),
      ),
    ),
  )

export const getFailures: {
  <E, A>(matching: Matching<E, A>): ReadonlyArray<E>
} = flow(getResults, Array.failures)

export const getSuccesses: {
  <E, A>(matching: Matching<E, A>): ReadonlyArray<A>
} = flow(getResults, Array.successes)

export const getOptions: {
  <E, A>(matching: Matching<E, A>): ReadonlyArray<Option.Option<A>>
} = flow(getResults, Array.map(Option.fromResult))

export const getOrElseAll: {
  <E, A>(
    onDefault: (e: E) => A,
  ): <B>(matching: Matching<E, B>) => ReadonlyArray<A | B>
} = onDefault => flow(getResults, Array.map(Result.getOrElse(onDefault)))
