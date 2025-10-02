import { Monoid } from '../../typeclasses/Monoid'
import {
  MinSemigroup,
  MaxSemigroup,
  ProductSemigroup,
  SumSemigroup,
} from './semigroup'

export const SumMonoid: Monoid<number> = {
  ...SumSemigroup,
  empty: 0,
}

export const ProductMonoid: Monoid<number> = {
  ...ProductSemigroup,
  empty: 1,
}

export const MinMonoid: Monoid<number> = {
  ...MinSemigroup,
  empty: Infinity,
}

export const MaxMonoid: Monoid<number> = {
  ...MaxSemigroup,
  empty: -Infinity,
}
