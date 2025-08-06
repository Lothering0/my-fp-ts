import * as eq from "../types/Eq"
import * as matching from "./Matching"
import { LazyArg } from "../types/utils"
import { Predicate } from "./Predicate"

export interface MatchingEq<E, A> extends matching.Matching<E, A> {
  readonly Eq: eq.Eq<E>
}

export const match: {
  <E>(Eq: eq.Eq<E>): (value: E) => MatchingEq<E, never>
} = Eq => value => ({
  patterns: [],
  Eq,
  value,
})

export const on: {
  <E, A>(
    p: Predicate<E>,
    a: LazyArg<A>,
  ): <B>(self: MatchingEq<E, B>) => MatchingEq<E, A | B>
} = matching.on as typeof on

export const whenEquals: {
  <E, A>(
    Eq: eq.Eq<E>,
    pattern: NoInfer<E>,
    a: LazyArg<A>,
  ): <B>(self: MatchingEq<E, B>) => MatchingEq<E, A | B>
} = matching.whenEquals as typeof whenEquals

export const when =
  <E, A>(pattern: NoInfer<E>, a: LazyArg<A>) =>
  <B>(self: MatchingEq<E, B>): MatchingEq<E, A | B> =>
    whenEquals (self.Eq, pattern, a) (self)

export const whenInstance: {
  <E, A>(
    constructor: new (...args: unknown[]) => NoInfer<E>,
    a: LazyArg<A>,
  ): <B>(self: MatchingEq<E, B>) => MatchingEq<E, A | B>
} = matching.whenInstance as typeof whenInstance
