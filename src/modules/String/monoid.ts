import * as Monoid_ from '../../typeclasses/Monoid'
import { Semigroup } from './semigroup'

export const empty = ''

export const Monoid: Monoid_.Monoid<string> = {
  ...Semigroup,
  empty,
}
