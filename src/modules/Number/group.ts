import { Group } from '../../typeclasses/Group'
import { ProductMonoid, SumMonoid } from './monoid'

export const SumGroup: Group<number> = {
  ...SumMonoid,
  inverse: x => -x,
}

export const ProductGroup: Group<number> = {
  ...ProductMonoid,
  inverse: x => 1 / x,
}
