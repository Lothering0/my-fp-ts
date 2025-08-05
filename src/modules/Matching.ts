import * as readonlyArray from "./ReadonlyArray"
import * as option from "./Option"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"
import { pipe } from "../utils/flow"
import { Predicate } from "./Predicate"
import { constant } from "../utils/constant"

interface Matching<E, A> {
  readonly patterns: ReadonlyArray<[Predicate<E>, LazyArg<A>]>
  readonly value: E
  readonly onDefault: (e: E) => A
  readonly defaultEq: option.Option<eq.Eq<E>>
}

const default_: {
  <E, A>(onDefault: (e: E) => A): (value: E) => Matching<E, A>
} = onDefault => value => ({
  patterns: [],
  value,
  onDefault,
  defaultEq: option.none,
})

export { default_ as default }

export const defaultEq: {
  <E, A>(Eq: eq.Eq<E>, onDefault: (e: E) => A): (value: E) => Matching<E, A>
} = (Eq, onDefault) => value => ({
  patterns: [],
  value,
  onDefault,
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

export const match =
  <E, A>(pattern: E, a: LazyArg<A>) =>
  <B>(self: Matching<E, B>): Matching<E, A | B> => ({
    ...self,
    patterns: pipe (
      self.patterns,
      readonlyArray.append ([eq.EqStrict.equals (pattern), a as LazyArg<A | B>]),
    ),
  })

export const matchInstance =
  <E, A>(constructor: new (...args: unknown[]) => E, a: LazyArg<A>) =>
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

export const equals =
  <E, A>(pattern: E, a: LazyArg<A>) =>
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

export const run: {
  <E, A>(self: Matching<E, A>): A
} = self =>
  pipe (
    self.patterns,
    readonlyArray.find (([p]) => p (self.value)),
    option.match (
      () => self.onDefault (self.value),
      ([, f]) => f (),
    ),
  )
