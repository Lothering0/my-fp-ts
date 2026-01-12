import * as Array from './readonly-array'
import * as Alt_ from '../../typeclasses/Alt'
import { concat } from './utils'

export const orElse =
  <F extends ReadonlyArray<any>>(array: F) =>
  <G extends ReadonlyArray<any>>(selfArray: G): Array.OrNonEmpty<F, G> =>
    concat(array)(selfArray)

export const Alt: Alt_.Alt<Array.Hkt> = {
  orElse,
}

export const NonEmptyAlt: Alt_.Alt<Array.NonEmptyHkt> = {
  orElse,
}
