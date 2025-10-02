import { Monoid } from '../../typeclasses/Monoid'
import { AllSemigroup, AnySemigroup } from './semigroup'

export const AnyMonoid: Monoid<boolean> = {
  ...AnySemigroup,
  empty: false,
}

export const AllMonoid: Monoid<boolean> = {
  ...AllSemigroup,
  empty: true,
}
