import { Monoid } from "../types/Monoid"
import { Semigroup } from "../types/Semigroup"
import { overload } from "../utils/overloads"

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

interface ConcatPointed {
  (start: string, end: string): string
}

interface ConcatPointFree {
  (end: string): (start: string) => string
}

interface Concat extends ConcatPointed, ConcatPointFree {}

export const concat: Concat = overload (1, semigroup.concat)

interface SplitPointed {
  (a: string, b: string): string[]
}

interface SplitPointFree {
  (b: string): (a: string) => string[]
}

interface Split extends SplitPointed, SplitPointFree {}

const splitPointed: SplitPointed = (a, b) => a.split (b)
export const split: Split = overload (1, splitPointed)
