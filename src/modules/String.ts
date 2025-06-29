import { Monoid } from "../types/Monoid"
import { Semigroup } from "../types/Semigroup"
import { overload } from "../utils/overloads"

export const toLowerCase = <A extends string = string>(a: A): Lowercase<A> =>
  a.toLowerCase () as Lowercase<A>

export const toUpperCase = <A extends string = string>(
  a: A,
): Uppercase<string> => a.toUpperCase () as Uppercase<A>

export const repeat: {
  (n: number): (s: string) => string
  (s: string, n: number): string
} = overload (1, (string, count) => string.repeat (count))

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
  (b: string): (a: string) => string[]
  (a: string, b: string): string[]
} = overload (1, (a, b) => a.split (b))
