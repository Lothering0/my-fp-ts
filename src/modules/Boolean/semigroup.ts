import { Semigroup } from '../../typeclasses/Semigroup'
import { and, or } from './utils'

export const AnySemigroup: Semigroup<boolean> = {
  combine: or,
}

export const AllSemigroup: Semigroup<boolean> = {
  combine: and,
}
