import { Semigroup } from '../../typeclasses/Semigroup'
import { curry } from '../../utils/currying'
import { add, multiply } from './utils'

export const SemigroupSum: Semigroup<number> = {
  combine: add,
}

export const SemigroupProduct: Semigroup<number> = {
  combine: multiply,
}

export const SemigroupMin: Semigroup<number> = {
  combine: curry(Math.min),
}

export const SemigroupMax: Semigroup<number> = {
  combine: curry(Math.max),
}
