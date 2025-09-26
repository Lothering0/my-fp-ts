import * as semigroup from '../../typeclasses/Semigroup'
import { concat } from './utils'

export const Semigroup: semigroup.Semigroup<string> = {
  combine: concat,
}
