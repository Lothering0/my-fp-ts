import * as Option from '../Option'
import * as Boolean from '../Boolean'
import * as Array from '../ReadonlyArray'
import { flow, pipe } from '../../utils/flow'

export const length: {
  (string: string): number
} = string => string.length

export const toLowerCase = <A extends string = string>(
  string: A,
): Lowercase<A> => string.toLowerCase() as Lowercase<A>

export const toUpperCase = <A extends string = string>(
  string: A,
): Uppercase<A> => string.toUpperCase() as Uppercase<A>

export const repeat: {
  (count: number): (string: string) => string
} = count => string => string.repeat(count)

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
  (string: string): string is `${string}${A}${string}` =>
    string.includes(substring)

export const startsWith =
  <A extends string = string>(substring: A) =>
  (string: string): string is `${A}${string}` =>
    string.startsWith(substring)

export const endsWith =
  <A extends string = string>(substring: A) =>
  (string: string): string is `${string}${A}` =>
    string.endsWith(substring)

export const slice: {
  (start: number, end?: number): (string: string) => string
} = (start, end) => string => string.slice(start, end)

export const split: {
  (separator: string): (string: string) => ReadonlyArray<string>
} = separator => string => string.split(separator)

export const replace: {
  (from: string | RegExp, to: string): (string: string) => string
} = (from, to) => string => string.replace(from, to)

export const trim: {
  (string: string): string
} = string => string.trim()

export const trimStart: {
  (string: string): string
} = string => string.trimStart()

export const trimEnd: {
  (string: string): string
} = string => string.trimEnd()

export const toReadonlyArray: {
  (string: string): ReadonlyArray<string>
} = split('')

export const has: {
  (i: number): (string: string) => boolean
} = i => string => i >= 0 && i < length(string)

export const isOutOfBounds: {
  (i: number): (string: string) => boolean
} = i => flow(has(i), Boolean.not)

export const lookup: {
  (i: number): (string: string) => Option.Option<string>
} = i => string =>
  pipe(
    string,
    has(i),
    Boolean.match({
      onTrue: () => pipe(string[i]!, Option.some),
      onFalse: Option.none,
    }),
  )

/** Like `lookup` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const at: {
  (i: number): (string: string) => Option.Option<string>
} = i => string =>
  pipe(
    i < length(string),
    Boolean.and(i >= -length(string)),
    Boolean.match({
      onTrue: () => pipe(string.at(i)!, Option.some),
      onFalse: Option.none,
    }),
  )

export const lookupCharCode: {
  (i: number): (string: string) => Option.Option<number>
} = i => string =>
  pipe(
    string,
    has(i),
    Boolean.match({
      onTrue: () => pipe(string.charCodeAt(i), Option.some),
      onFalse: Option.none,
    }),
  )

/** Like `lookupCharCode` but accepts also negative integers where -1 is index of the last char, -2 of the pre-last and so on. */
export const charCodeAt: {
  (i: number): (string: string) => Option.Option<number>
} = i =>
  flow(
    at(i),
    Option.map(char => char.charCodeAt(0)),
  )

export const reverse: {
  (string: string): string
} = flow(toReadonlyArray, Array.reverse, Array.join(''))
