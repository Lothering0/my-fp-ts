import * as Monoid_ from '../../typeclasses/Monoid'
import { ConcatSemigroup } from './semigroup'

export const empty = ''

export const ConcatMonoid: Monoid_.Monoid<string> = {
  ...ConcatSemigroup,
  empty,
}
