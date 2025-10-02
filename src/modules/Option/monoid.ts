import { Option, none } from './option'
import { Monoid } from '../../typeclasses/Monoid'
import { Semigroup } from '../../typeclasses/Semigroup'
import { getOptionSemigroup } from './semigroup'

export const empty = none

export const getOptionMonoid: {
  <A>(Semigroup: Semigroup<A>): Monoid<Option<A>>
} = Semigroup => ({
  empty: none,
  ...getOptionSemigroup(Semigroup),
})
