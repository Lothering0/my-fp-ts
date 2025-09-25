import * as option from "../Option"
import * as boolean from "../Boolean"
import * as array from "../ReadonlyArray"
import { flow, pipe } from "../../utils/flow"

export const length: {
  (self: string): number
} = self => self.length

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

export const has: {
  (i: number): (self: string) => boolean
} = i => self => i >= 0 && i < length (self)

export const isOutOfBounds: {
  (i: number): (self: string) => boolean
} = i => flow (has (i), boolean.not)

export const lookup: {
  (i: number): (self: string) => option.Option<string>
} = i => self =>
  pipe (
    self,
    has (i),
    boolean.match ({
      onTrue: () => pipe (self[i]!, option.some),
      onFalse: option.zero,
    }),
  )

/** Like `lookup` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const at: {
  (i: number): (self: string) => option.Option<string>
} = i => self =>
  pipe (
    i < length (self),
    boolean.and (i >= -length (self)),
    boolean.match ({
      onTrue: () => pipe (self.at (i)!, option.some),
      onFalse: option.zero,
    }),
  )

export const lookupCharCode: {
  (i: number): (self: string) => option.Option<number>
} = i => self =>
  pipe (
    self,
    has (i),
    boolean.match ({
      onTrue: () => pipe (self.charCodeAt (i), option.some),
      onFalse: option.zero,
    }),
  )

/** Like `lookupCharCode` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const charCodeAt: {
  (i: number): (self: string) => option.Option<number>
} = i =>
  flow (
    at (i),
    option.map (char => char.charCodeAt (0)),
  )

export const reverse: {
  (self: string): string
} = flow (toReadonlyArray, array.reverse, array.join (""))
