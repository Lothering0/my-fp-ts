import { Semigroup } from '../../typeclasses/Semigroup'
import { Duration } from './duration'
import { add } from './utils'

export const SemigroupSum: Semigroup<Duration> = {
  combine: add,
}
