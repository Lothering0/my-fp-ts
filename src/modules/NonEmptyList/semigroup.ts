import { Semigroup } from '../../typeclasses/Semigroup'
import { NonEmptyList } from './non-empty-list'
import { concat } from './utils'

export const getConcatSemigroup: {
  <A>(): Semigroup<NonEmptyList<A>>
} = () => ({
  combine: concat,
})
