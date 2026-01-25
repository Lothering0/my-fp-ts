import * as List from './list'
import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'

export const orElse =
  <F extends List.List<any>>(list: F) =>
  <G extends List.List<any>>(selfList: G): List.OrNonEmpty<F, G> =>
    concat(list)(selfList)

export const Alt: Alt_.Alt<List.Hkt> = {
  orElse,
}
