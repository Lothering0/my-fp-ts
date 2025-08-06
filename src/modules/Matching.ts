import * as readonlyArray from "./ReadonlyArray"
import * as option from "./Option"
import * as result from "./Result"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"
import { flow, pipe } from "../utils/flow"
import { Predicate } from "./Predicate"
import { constant } from "../utils/constant"

interface Matching<E, A> {
  readonly patterns: ReadonlyArray<[Predicate<E>, LazyArg<A>]>
  readonly value: E
  readonly defaultEq: option.Option<eq.Eq<E>>
}

export const match: {
  <E>(value: E): Matching<E, never>
} = value => ({
  patterns: [],
  value,
  defaultEq: option.none,
})

export const matchEq: {
  <E>(Eq: eq.Eq<E>): <A>(value: E) => Matching<E, A>
} = Eq => value => ({
  patterns: [],
  value,
  defaultEq: option.some (Eq),
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

export const when =
  <E, A>(pattern: NoInfer<E>, a: LazyArg<A>) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.patterns,
      readonlyArray.append ([eq.EqStrict.equals (pattern), a as LazyArg<A | B>]),
    ),
  })

export const whenInstance =
  <E, A>(constructor: new (...args: unknown[]) => NoInfer<E>, a: LazyArg<A>) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.patterns,
      readonlyArray.append ([
        e => e instanceof constructor,
        a as LazyArg<A | B>,
      ]),
    ),
  })

export const whenEquals =
  <E, A>(pattern: NoInfer<E>, a: LazyArg<A>) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.defaultEq,
      option.match (constant (self.patterns), Eq =>
        pipe (
          self.patterns,
          readonlyArray.append ([Eq.equals (pattern), a as LazyArg<A | B>]),
        ),
      ),
    ),
  })

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
