import { Monoid } from '../../typeclasses/Monoid'
import { Duration } from './duration'
import { SumSemigroup } from './semigroup'

export const empty: Duration = { milliseconds: 0 }

export const SumMonoid: Monoid<Duration> = {
  ...SumSemigroup,
  empty,
}
