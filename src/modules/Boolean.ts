import * as show_ from "../types/Show"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"

export const not: {
  <A extends boolean>(a: A): A extends true ? false : true
} = <A>(a: A) => !a as A extends true ? false : true

export const or: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a || self

export const and: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a && self

export const match: {
  <A, B = A>(onFalse: LazyArg<A>, onTrue: LazyArg<B>): (self: boolean) => A | B
} = (onFalse, onTrue) => self => self ? onTrue () : onFalse ()

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
