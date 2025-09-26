import { Semigroup } from '../../typeclasses/Semigroup'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'
import { concat } from './utils'

export const getSemigroup: {
  <A>(): Semigroup<NonEmptyReadonlyArray<A>>
} = () => ({
  combine: concat,
})
