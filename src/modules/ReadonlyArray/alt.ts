import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'
import { ReadonlyArrayHkt } from './readonly-array'

export const orElse =
  <Out>(that: ReadonlyArray<Out>) =>
  <In>(self: ReadonlyArray<In>): ReadonlyArray<In | Out> =>
    concat<In | Out>(that)(self)

export const Alt: Alt_.Alt<ReadonlyArrayHkt> = {
  orElse,
}
