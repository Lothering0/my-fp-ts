import * as S from "../types/Semigroup"
import * as M from "../types/Monoid"
import * as Sh from "../types/Show"
import * as E from "../types/Eq"
import { overload } from "../utils/overloads"

export const toLowerCase = <S extends string = string>(self: S): Lowercase<S> =>
  self.toLowerCase () as Lowercase<S>

export const toUpperCase = <S extends string = string>(
  self: S,
): Uppercase<string> => self.toUpperCase () as Uppercase<S>

export const repeat: {
  (count: number): (self: string) => string
  (self: string, count: number): string
} = overload (1, (self, count) => self.repeat (count))

export const Semigroup: S.Semigroup<string> = {
  concat: overload (1, (x, y) => x.concat (y)),
}

export const Monoid: M.Monoid<string> = {
  ...Semigroup,
  empty: "",
}

export const concat: {
  (end: string): (start: string) => string
  (start: string, end: string): string
} = Semigroup.concat

export const split: {
  (separator: string): (self: string) => string[]
  (self: string, separator: string): string[]
} = overload (1, (self, separator) => self.split (separator))

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: Sh.Show<string> = { show }

export const Eq: E.Eq<number> = E.EqStrict
