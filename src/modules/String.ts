import * as semigroup from "../types/Semigroup"
import * as monoid from "../types/Monoid"
import * as show_ from "../types/Show"
import * as eq from "../types/Eq"
import * as number from "./Number"
import { pipe } from "../utils/flow"

export const empty = ""

export const length: {
  (self: string): number
} = self => self.length

export const isEmpty = (self: string): self is "" =>
  pipe (self, length, number.equals (0))

export const match: {
  <A, B = A>(
    onEmpty: (e: "") => A,
    onNonEmpty: (a: string) => B,
  ): (self: string) => A | B
} = (onEmpty, onNonEmpty) => self =>
  isEmpty (self) ? onEmpty ("") : onNonEmpty (self)

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
