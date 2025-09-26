import { Monoid } from '../../typeclasses/Monoid'
import { SemigroupAll, SemigroupAny } from './semigroup'

export const MonoidAny: Monoid<boolean> = {
  ...SemigroupAny,
  empty: false,
}

export const MonoidAll: Monoid<boolean> = {
  ...SemigroupAll,
  empty: true,
}
