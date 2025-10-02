import { Semigroup } from '../../typeclasses/Semigroup'
import { Duration } from './duration'
import { add } from './utils'

export const SumSemigroup: Semigroup<Duration> = {
  combine: add,
}
