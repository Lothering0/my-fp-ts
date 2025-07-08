import { Show } from "../types/Show"
import { Monoid } from "../types/Monoid"
import { Semigroup } from "../types/Semigroup"
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

export const semigroup: Semigroup<string> = {
  concat: (x, y) => x.concat (y),
}

export const monoid: Monoid<string> = {
  ...semigroup,
  empty: "",
}

export const concat: {
  (end: string): (start: string) => string
  (start: string, end: string): string
} = overload (1, semigroup.concat)

export const split: {
  (separator: string): (self: string) => string[]
  (self: string, separator: string): string[]
} = overload (1, (self, separator) => self.split (separator))

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

const Show: Show<string> = { show }

export { Show }
