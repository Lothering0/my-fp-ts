import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'
import { List, ListHkt } from './list'

export const orElse =
  <Out>(list: List<Out>) =>
  <In>(selfList: List<In>): List<In | Out> =>
    concat<In | Out>(list)(selfList)

export const Alt: Alt_.Alt<ListHkt> = {
  orElse,
}
