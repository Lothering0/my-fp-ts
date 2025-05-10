import * as O from "./option"
import { not } from "./boolean"
import { Predicate } from "./predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { pipe } from "../utils/pipe"

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

type Add = (x: number) => (y: number) => number
export const add: Add = x => y => x + y

type Subtract = (x: number) => (y: number) => number
export const subtract: Subtract = x => y => x - y

type Multiply = (x: number) => (y: number) => number
export const multiply: Multiply = x => y => x * y

type Divide = (x: number) => (y: number) => number
export const divide: Divide = x => y => x / y

type DivideSafe = (x: number) => (y: number) => O.Option<number>
export const divideSafe: DivideSafe = x => y =>
  y === 0 ? O.none : O.some (x / y)

export const isEven: Predicate<number> = a => a % 2 === 0

export const isOdd: Predicate<number> = a => pipe (a, isEven, not)
