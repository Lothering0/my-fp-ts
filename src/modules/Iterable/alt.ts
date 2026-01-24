import * as Alt_ from '../../typeclasses/Alt'
import * as Iterable from './iterable'
import { concat } from './utils'

export const orElse =
  <F extends Iterable<any>>(end: F) =>
  <G extends Iterable<any>>(start: G): Iterable.OrNonEmpty<F, G> =>
    concat(end)(start)

export const Alt: Alt_.Alt<Iterable.Hkt> = {
  orElse,
}

export const NonEmptyAlt: Alt_.Alt<Iterable.NonEmptyHkt> = {
  orElse,
}
