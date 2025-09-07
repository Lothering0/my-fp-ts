import * as semigroup from "../typeclasses/Semigroup"
import * as monoid from "../typeclasses/Monoid"
import * as show_ from "../typeclasses/Show"
import * as eq from "../typeclasses/Eq"
import * as number from "./Number"
import { pipe } from "../utils/flow"

export const empty = ""

export const length: {
  (self: string): number
} = self => self.length

export const isEmpty = (self: string): self is "" =>
  pipe (self, length, number.equals (0))

export interface Matchers<A, B = A> {
  readonly onEmpty: (e: "") => A
  readonly onNonEmpty: (a: string) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (self: string) => A | B
} = matchers => self =>
  isEmpty (self) ? matchers.onEmpty ("") : matchers.onNonEmpty (self)

export const toLowerCase = <A extends string = string>(self: A): Lowercase<A> =>
  self.toLowerCase () as Lowercase<A>

export const toUpperCase = <A extends string = string>(self: A): Uppercase<A> =>
  self.toUpperCase () as Uppercase<A>

export const repeat: {
  (count: number): (self: string) => string
} = count => self => self.repeat (count)

export const concat: {
  <B extends string>(end: B): <A extends string>(start: A) => `${A}${B}`
} = end => start => `${start}${end}`

/** Alias for `concat` */
export const append = concat

export const prepend: {
  <A extends string>(start: A): <B extends string>(end: B) => `${A}${B}`
} = start => end => `${start}${end}`

export const includes =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${string}${A}${string}` =>
    self.includes (substring)

export const startsWith =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${A}${string}` =>
    self.startsWith (substring)

export const endsWith =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${string}${A}` =>
    self.endsWith (substring)

export const slice: {
  (start: number, end?: number): (self: string) => string
} = (start, end) => self => self.slice (start, end)

export const split: {
  (separator: string): (self: string) => ReadonlyArray<string>
} = separator => self => self.split (separator)

export const replace: {
  (from: string | RegExp, to: string): (self: string) => string
} = (from, to) => self => self.replace (from, to)

export const trim: {
  (self: string): string
} = self => self.trim ()

export const trimStart: {
  (self: string): string
} = self => self.trimStart ()

export const trimEnd: {
  (self: string): string
} = self => self.trimEnd ()

export const toReadonlyArray: {
  (self: string): ReadonlyArray<string>
} = split ("")

export const show: {
  <S extends string>(self: S): `"${S}"`
} = self => `"${self}"`

export const Show: show_.Show<string> = { show }

export const Eq: eq.Eq<string> = eq.EqStrict

export const { equals } = Eq

export const Semigroup: semigroup.Semigroup<string> = {
  combine: concat,
}

export const Monoid: monoid.Monoid<string> = {
  ...Semigroup,
  empty,
}
