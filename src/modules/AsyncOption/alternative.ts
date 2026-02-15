import * as Alternative_ from '../../typeclasses/Alternative'
import { AsyncOption, Hkt } from './async-option'
import { _AsyncOption } from './_internal'

export const zero: {
  <A = never>(): AsyncOption<A>
} = _AsyncOption.zero

export const Alternative: Alternative_.Alternative<Hkt> =
  _AsyncOption.Alternative
