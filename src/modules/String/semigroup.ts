import * as semigroup from '../../typeclasses/Semigroup'
import { concat } from './utils'

export const ConcatSemigroup: semigroup.Semigroup<string> = {
  combine: concat,
}
