import * as O from "./Option"
import * as E from "../types/Eq"
import * as S from "../types/Show"
import { not } from "./Boolean"
import { Predicate } from "./Predicate"
import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"
import { flow } from "../utils/flow"
import { overload } from "../utils/overloads"

export const SemigroupSum: Semigroup<number> = {
  concat: overload (1, (x, y) => x + y),
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
  concat: overload (1, (x, y) => x * y),
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

export const Show: S.Show<number> = { show }

export const Eq: E.Eq<number> = E.EqStrict

export const { equals } = Eq

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
