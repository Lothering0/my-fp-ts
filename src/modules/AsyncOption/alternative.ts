import * as Alternative_ from '../../typeclasses/Alternative'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './_internal'

export const zero: {
  <A = never>(): AsyncOption<A>
} = _AsyncOption.zero

export const Alternative: Alternative_.Alternative<AsyncOptionHkt> =
  _AsyncOption.Alternative
