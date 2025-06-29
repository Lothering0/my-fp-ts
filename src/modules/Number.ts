import * as O from "./Option"
import { not } from "./Boolean"
import { Predicate } from "./Predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { flow } from "../utils/flow"
import { overload } from "../utils/overloads"

export const sumSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y,
}

export const sumMonoid: Monoid<number> = {
  ...sumSemigroup,
  empty: 0,
}

export const sumGroup: Group<number> = {
  ...sumMonoid,
  inverse: a => -a,
}

export const productSemigroup: Semigroup<number> = {
  concat: (x, y) => x * y,
}

export const productMonoid: Monoid<number> = {
  ...productSemigroup,
  empty: 1,
}

export const productGroup: Group<number> = {
  ...productMonoid,
  inverse: a => 1 / a,
}

export const add: {
  (b: number): (a: number) => number
  (a: number, b: number): number
} = overload (1, (a, b) => a + b)

export const subtract: {
  (b: number): (a: number) => number
  (a: number, b: number): number
} = overload (1, (a, b) => a - b)

export const multiply: {
  (b: number): (a: number) => number
  (a: number, b: number): number
} = overload (1, (a, b) => a * b)

export const divide: {
  (b: number): (a: number) => number
  (a: number, b: number): number
} = overload (1, (a, b) => a / b)

export const divideSafe: {
  (b: number): (a: number) => O.Option<number>
  (a: number, b: number): O.Option<number>
} = overload (1, (a, b) => b === 0 ? O.none : O.some (a / b))

export const isEven: Predicate<number> = a => a % 2 === 0

export const isOdd: Predicate<number> = flow (isEven, not)
