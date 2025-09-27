import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'
import { IterableHkt } from './iterable'

export const orElse =
  <Out>(that: Iterable<Out>) =>
  <In>(self: Iterable<In>): Iterable<In | Out> =>
    concat<In | Out>(that)(self)

export const Alt: Alt_.Alt<IterableHkt> = {
  orElse,
}
