import * as option from "./Option"
import * as eq from "../types/Eq"
import * as show_ from "../types/Show"
import { not } from "./Boolean"
import { Predicate } from "./Predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { flow } from "../utils/flow"

export const add: {
  (y: number): (x: number) => number
} = y => x => x + y

export const subtract: {
  (y: number): (x: number) => number
} = y => x => x - y

export const multiply: {
  (y: number): (x: number) => number
} = y => x => x * y

export const divide: {
  (y: number): (x: number) => number
} = y => x => x / y

export const divideSafe: {
  (y: number): (x: number) => option.Option<number>
} = y => x => y === 0 ? option.none : option.some (x / y)

export const lessThan: {
  (y: number): (x: number) => boolean
} = y => x => x < y

export const lessThanOrEquals: {
  (y: number): (x: number) => boolean
} = y => x => x <= y

export const moreThan: {
  (y: number): (x: number) => boolean
} = y => x => x > y

export const moreThanOrEquals: {
  (y: number): (x: number) => boolean
} = y => x => x >= y

export const SemigroupSum: Semigroup<number> = {
  concat: add,
}

export const MonoidSum: Monoid<number> = {
  ...SemigroupSum,
  empty: 0,
}

export const GroupSum: Group<number> = {
  ...MonoidSum,
  inverse: x => -x,
}

export const SemigroupProduct: Semigroup<number> = {
  concat: multiply,
}

export const MonoidProduct: Monoid<number> = {
  ...SemigroupProduct,
  empty: 1,
}

export const GroupProduct: Group<number> = {
  ...MonoidProduct,
  inverse: x => 1 / x,
}

export const show: {
  <N extends number>(self: N): `${N}`
} = self => `${self}`

export const Show: show_.Show<number> = { show }

export const Eq: eq.Eq<number> = eq.EqStrict

export const { equals } = Eq

export const isEven: Predicate<number> = x => x % 2 === 0

export const isOdd: Predicate<number> = flow (isEven, not)
