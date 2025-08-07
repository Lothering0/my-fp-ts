import * as readonlyArray from "./ReadonlyArray"
import * as option from "./Option"
import * as result from "./Result"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"
import { flow, pipe } from "../utils/flow"
import { Predicate } from "./Predicate"

export interface Matching<E, A> {
  readonly Eq: eq.Eq<E>
  readonly patterns: ReadonlyArray<[Predicate<E>, LazyArg<A>]>
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

export const on =
  <E, A>(p: Predicate<E>, a: LazyArg<A>) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.patterns,
      readonlyArray.append ([p, a as LazyArg<A | B>]),
    ),
  })

export const whenEquals: {
  <E, A>(
    Eq: eq.Eq<E>,
    pattern: NoInfer<E>,
    a: LazyArg<A>,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (Eq, pattern, a) => on (e => Eq.equals (pattern) (e), a)

export const when: {
  <E, A>(
    pattern: NoInfer<E>,
    a: LazyArg<A>,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = <E, A>(pattern: E, a: LazyArg<A>) =>
  whenEquals<E, A> (eq.EqStrict, pattern, a)

export const whenInstance: {
  <E, A>(
    constructor: new (...args: unknown[]) => NoInfer<E>,
    a: LazyArg<A>,
  ): <B>(self: Matching<E, B>) => Matching<E, A | B>
} = (constructor, a) => on (e => e instanceof constructor, a)

export const getResult: {
  <E, A>(self: Matching<E, A>): result.Result<E, A>
} = self =>
  pipe (
    self.patterns,
    readonlyArray.find (([p]) => p (self.value)),
    option.match (
      () => result.fail (self.value),
      ([, f]) => result.succeed (f ()),
    ),
  )

export const getOption: {
  <E, A>(self: Matching<E, A>): option.Option<A>
} = flow (getResult, option.fromResult)

export const getOrElse: {
  <E, A>(onDefault: (e: E) => A): <B>(self: Matching<E, B>) => A | B
} = onDefault => flow (getResult, result.getOrElse (onDefault))
