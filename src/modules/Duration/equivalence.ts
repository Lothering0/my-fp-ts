import * as Equivalence_ from '../../typeclasses/Equivalence'
import { Duration } from './duration'
import { equals } from './utils'

export const Equivalence: Equivalence_.Equivalence<Duration> = {
  equals,
}
