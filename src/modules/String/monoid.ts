import * as monoid from '../../typeclasses/Monoid'
import { Semigroup } from './semigroup'

export const empty = ''

export const Monoid: monoid.Monoid<string> = {
  ...Semigroup,
  empty,
}
