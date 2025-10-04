import * as Option from '../Option'
import * as Boolean from '../Boolean'
import * as Array from '../ReadonlyArray'
import { flow, pipe } from '../../utils/flow'

export const length: {
  (self: string): number
} = self => self.length

export const toLowerCase = <A extends string = string>(self: A): Lowercase<A> =>
  self.toLowerCase() as Lowercase<A>

export const toUpperCase = <A extends string = string>(self: A): Uppercase<A> =>
  self.toUpperCase() as Uppercase<A>

export const repeat: {
  (count: number): (self: string) => string
} = count => self => self.repeat(count)

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
    self.includes(substring)

export const startsWith =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${A}${string}` =>
    self.startsWith(substring)

export const endsWith =
  <A extends string = string>(substring: A) =>
  (self: string): self is `${string}${A}` =>
    self.endsWith(substring)

export const slice: {
  (start: number, end?: number): (self: string) => string
} = (start, end) => self => self.slice(start, end)

export const split: {
  (separator: string): (self: string) => ReadonlyArray<string>
} = separator => self => self.split(separator)

export const replace: {
  (from: string | RegExp, to: string): (self: string) => string
} = (from, to) => self => self.replace(from, to)

export const trim: {
  (self: string): string
} = self => self.trim()

export const trimStart: {
  (self: string): string
} = self => self.trimStart()

export const trimEnd: {
  (self: string): string
} = self => self.trimEnd()

export const toReadonlyArray: {
  (self: string): ReadonlyArray<string>
} = split('')

export const has: {
  (i: number): (self: string) => boolean
} = i => self => i >= 0 && i < length(self)

export const isOutOfBounds: {
  (i: number): (self: string) => boolean
} = i => flow(has(i), Boolean.not)

export const lookup: {
  (i: number): (self: string) => Option.Option<string>
} = i => self =>
  pipe(
    self,
    has(i),
    Boolean.match({
      onTrue: () => pipe(self[i]!, Option.some),
      onFalse: Option.none,
    }),
  )

/** Like `lookup` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const at: {
  (i: number): (self: string) => Option.Option<string>
} = i => self =>
  pipe(
    i < length(self),
    Boolean.and(i >= -length(self)),
    Boolean.match({
      onTrue: () => pipe(self.at(i)!, Option.some),
      onFalse: Option.none,
    }),
  )

export const lookupCharCode: {
  (i: number): (self: string) => Option.Option<number>
} = i => self =>
  pipe(
    self,
    has(i),
    Boolean.match({
      onTrue: () => pipe(self.charCodeAt(i), Option.some),
      onFalse: Option.none,
    }),
  )

/** Like `lookupCharCode` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const charCodeAt: {
  (i: number): (self: string) => Option.Option<number>
} = i =>
  flow(
    at(i),
    Option.map(char => char.charCodeAt(0)),
  )

export const reverse: {
  (self: string): string
} = flow(toReadonlyArray, Array.reverse, Array.join(''))
