import * as show_ from "../typeclasses/Show"
import * as eq from "../typeclasses/Eq"
import { Semigroup } from "../typeclasses/Semigroup"
import { Monoid } from "../typeclasses/Monoid"

export const not: {
  <A extends boolean>(a: A): A extends true ? false : true
} = <A>(a: A) => !a as A extends true ? false : true

export const or: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a || self

export const and: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a && self

export interface Matchers<A, B = A> {
  readonly onFalse: (e: false) => A
  readonly onTrue: (a: true) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (self: boolean) => A | B
} = matchers => self => self ? matchers.onTrue (true) : matchers.onFalse (false)

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

export const Show: show_.Show<boolean> = { show }

export const Eq: eq.Eq<boolean> = eq.EqStrict

export const { equals } = Eq

export const SemigroupAny: Semigroup<boolean> = {
  combine: or,
}

export const SemigroupAll: Semigroup<boolean> = {
  combine: and,
}

export const MonoidAny: Monoid<boolean> = {
  ...SemigroupAny,
  empty: false,
}

export const MonoidAll: Monoid<boolean> = {
  ...SemigroupAll,
  empty: true,
}
