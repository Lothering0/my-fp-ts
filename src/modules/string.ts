import { curry } from "../utils/curry"
import { Monoid } from "../types/Monoid"
import { Semigroup } from "../types/Semigroup"

export const toLowerCase = <A extends string = string>(a: A): Lowercase<A> =>
  a.toLowerCase () as Lowercase<A>

export const toUpperCase = <A extends string = string>(
  a: A,
): Uppercase<string> => a.toUpperCase () as Uppercase<A>

type Repeat = (n: number) => (s: string) => string
export const repeat: Repeat = count => string => string.repeat (count)

export const semigroup: Semigroup<string> = {
  concat: (x, y) => x.concat (y),
}

export const monoid: Monoid<string> = {
  ...semigroup,
  empty: "",
}

type Concat = (a: string) => (b: string) => string
export const concat: Concat = curry (semigroup.concat)
