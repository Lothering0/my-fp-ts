import { Monoid } from '../../typeclasses/Monoid'
import { ReadonlyRecord } from './readonly-record'
import { getUnionSemigroup } from './semigroup'

export const getUnionMonoid: {
  <A>(Monoid: Monoid<A>): Monoid<ReadonlyRecord<string, A>>
} = Monoid => ({
  ...getUnionSemigroup(Monoid),
  empty: {},
})
