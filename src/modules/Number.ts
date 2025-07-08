import * as O from "./Option"
import { not } from "./Boolean"
import { Predicate } from "./Predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { flow } from "../utils/flow"
import { overload } from "../utils/overloads"
import { Show } from "../types/Show"

export const sumSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y,
}

export const sumMonoid: Monoid<number> = {
  ...sumSemigroup,
  empty: 0,
}

export const sumGroup: Group<number> = {
  ...sumMonoid,
  inverse: x => -x,
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
  inverse: x => 1 / x,
}

export const show: {
  <N extends number>(self: N): `${N}`
} = self => `${self}`

const Show: Show<number> = { show }

export { Show }

export const add: {
  (y: number): (x: number) => number
  (x: number, y: number): number
} = overload (1, (x, y) => x + y)

export const subtract: {
  (y: number): (x: number) => number
  (x: number, y: number): number
} = overload (1, (x, y) => x - y)

export const multiply: {
  (y: number): (x: number) => number
  (x: number, y: number): number
} = overload (1, (x, y) => x * y)

export const divide: {
  (y: number): (x: number) => number
  (x: number, y: number): number
} = overload (1, (x, y) => x / y)

export const divideSafe: {
  (y: number): (x: number) => O.Option<number>
  (x: number, y: number): O.Option<number>
} = overload (1, (x, y) => y === 0 ? O.none : O.some (x / y))

export const isEven: Predicate<number> = x => x % 2 === 0

export const isOdd: Predicate<number> = flow (isEven, not)
