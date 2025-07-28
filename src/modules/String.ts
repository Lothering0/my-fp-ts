import * as semigroup from "../types/Semigroup"
import * as monoid from "../types/Monoid"
import * as show_ from "../types/Show"
import * as eq from "../types/Eq"

export const toLowerCase = <S extends string = string>(self: S): Lowercase<S> =>
  self.toLowerCase () as Lowercase<S>

export const toUpperCase = <S extends string = string>(self: S): Uppercase<S> =>
  self.toUpperCase () as Uppercase<S>

export const repeat: {
  (count: number): (self: string) => string
} = count => self => self.repeat (count)

export const concat: {
  <B extends string>(end: B): <A extends string>(start: A) => `${A}${B}`
} = end => start => `${start}${end}`

export const includes =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${string}${A}${string}` =>
    self.includes (substring)

export const Semigroup: semigroup.Semigroup<string> = {
  concat,
}

export const Monoid: monoid.Monoid<string> = {
  ...Semigroup,
  empty: "",
}

export const split: {
  (separator: string): (self: string) => string[]
} = separator => self => self.split (separator)

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: show_.Show<string> = { show }

export const Eq: eq.Eq<string> = eq.EqStrict

export const { equals } = Eq
