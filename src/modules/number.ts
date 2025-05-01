import { Semigroup } from "../types/Semigroup"
import { Monoid } from "../types/Monoid"
import { Group } from "../types/Group"

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
