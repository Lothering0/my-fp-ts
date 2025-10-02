import { Group } from '../../typeclasses/Group'
import { Duration } from './duration'
import { SumMonoid } from './monoid'
import { multiply } from './utils'

export const SumGroup: Group<Duration> = {
  ...SumMonoid,
  inverse: multiply(-1),
}
