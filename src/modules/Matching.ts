import * as Array from './ReadonlyArray'
import * as Option from './Option'
import * as Result from './Result'
import * as Boolean from './Boolean'
import * as Equivalence_ from '../typeclasses/Equivalence'
import * as Predicate from './Predicate'
import * as Schema_ from './Schema'
import { flow, pipe } from '../utils/flow'
import { Refinement } from './Refinement'

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
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
  <E, A>(
    p: Predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} =
  <E, A>(p: Predicate.Predicate<E>, ea: (e: E) => A) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe(self.patterns, Array.append([p, ea as (e: E) => A | B])),
  })

export const onNot: {
  <E, A>(
    p: Predicate.Predicate<E>,
    ea: (e: E) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (p, ea) => on(Predicate.not(p), ea)

export const whenEquals: {
  <E, D extends E, A>(
    Equivalence: Equivalence_.Equivalence<E>,
    pattern: D,
    da: (d: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Equivalence, pattern, da) => on(Equivalence.equals(pattern), da)

export const whenNotEquals =
  <E, const D extends E, A>(
    Equivalence: Equivalence_.Equivalence<E>,
    pattern: D,
    ea: (e: Exclude<E, D>) => A,
  ) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    whenEquals(
      Equivalence_.reverse(Equivalence),
      pattern as Exclude<E, D>,
      ea,
    )(self)

export const when: {
  <E, const D extends E, A>(
    pattern: D,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (pattern, ea) => self => whenEquals(self.Equivalence, pattern, ea)(self)

export const whenNot =
  <E, const D extends E, A>(pattern: D, ea: (e: Exclude<E, D>) => A) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> =>
    pipe(
      self,
      whenEquals(
        Equivalence_.reverse(self.Equivalence),
        pattern as Exclude<E, D>,
        ea,
      ),
    )

export const whenInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) => on(e => e instanceof constructor, ea)

export const whenNotInstance: {
  <E, D extends E, A>(
    constructor: new (...args: unknown[]) => D,
    ea: (e: Exclude<E, D>) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (constructor, ea) =>
  on(e => pipe(e instanceof constructor, Boolean.not), ea)

export const whenSchema: {
  <E, D extends E, A>(
    Schema: Schema_.Schema<D>,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => on(Schema_.validate(Schema), ea)

export const whenNotSchema: {
  <E, D extends E, A>(
    Schema: Schema_.Schema<D>,
    ea: (e: D) => A,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Schema, ea) => onNot(Schema_.validate(Schema), ea)

export const getResult: {
  <E, A>(self: Matching<E, A>): Result.Result<E, A>
} = self =>
  pipe(
    self.patterns,
    Array.find(([p]) => p(self.value)),
    Option.match({
      onNone: () => Result.fail(self.value),
      onSome: ([, f]) => pipe(self.value, f, Result.succeed),
    }),
  )

export const getOption: {
  <E, A>(self: Matching<E, A>): Option.Option<A>
} = flow(getResult, Option.fromResult)

export const getOrElse: {
  <E, A>(onDefault: (e: E) => A): <B>(self: Matching<E, B>) => A | B
} = onDefault => flow(getResult, Result.getOrElse(onDefault))

export const getResults: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<Result.Result<E, A>>
} = self =>
  pipe(
    self.patterns,
    Array.map(([p, f]) =>
      pipe(
        self.value,
        p,
        Boolean.match({
          onFalse: () => Result.fail(self.value),
          onTrue: () => pipe(self.value, f, Result.succeed),
        }),
      ),
    ),
  )

export const getFailures: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<E>
} = flow(getResults, Array.failures)

export const getSuccesses: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<A>
} = flow(getResults, Array.successes)

export const getOptions: {
  <E, A>(self: Matching<E, A>): ReadonlyArray<Option.Option<A>>
} = flow(getResults, Array.map(Option.fromResult))

export const getOrElseAll: {
  <E, A>(
    onDefault: (e: E) => A,
  ): <B>(self: Matching<E, B>) => ReadonlyArray<A | B>
} = onDefault => flow(getResults, Array.map(Result.getOrElse(onDefault)))
