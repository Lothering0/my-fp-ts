import * as S from "../types/Semigroup"
import * as M from "../types/Monoid"
import * as Sh from "../types/Show"
import * as E from "../types/Eq"

export const toLowerCase = <S extends string = string>(self: S): Lowercase<S> =>
  self.toLowerCase () as Lowercase<S>

export const toUpperCase = <S extends string = string>(
  self: S,
): Uppercase<string> => self.toUpperCase () as Uppercase<S>

export const repeat: {
  (count: number): (self: string) => string
} = count => self => self.repeat (count)

export const Semigroup: S.Semigroup<string> = {
  concat: y => x => x.concat (y),
}

export const Monoid: M.Monoid<string> = {
  ...Semigroup,
  empty: "",
}

export const concat: {
  (end: string): (start: string) => string
} = Semigroup.concat

export const split: {
  (separator: string): (self: string) => string[]
} = separator => self => self.split (separator)

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: Sh.Show<string> = { show }

export const Eq: E.Eq<string> = E.EqStrict

export const { equals } = Eq
