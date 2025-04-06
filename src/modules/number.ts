import { Monoid, Semigroup } from "../types"

export const sumSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y,
}

export const sumMonoid: Monoid<number> = {
  ...sumSemigroup,
  empty: 0,
}

export const productSemigroup: Semigroup<number> = {
  concat: (x, y) => x * y,
}

export const productMonoid: Monoid<number> = {
  ...sumSemigroup,
  empty: 1,
}
