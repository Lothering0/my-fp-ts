import { Semigroup } from '../../typeclasses/Semigroup'
import { curry } from '../../utils/currying'
import { add, multiply } from './utils'

export const SumSemigroup: Semigroup<number> = {
  combine: add,
}

export const ProductSemigroup: Semigroup<number> = {
  combine: multiply,
}

export const MinSemigroup: Semigroup<number> = {
  combine: curry(Math.min),
}

export const MaxSemigroup: Semigroup<number> = {
  combine: curry(Math.max),
}
