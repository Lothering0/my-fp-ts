import * as Option from '../Option'
import { Async } from '../Async'
import { AsyncOption } from './async-option'
import { _AsyncOption } from './_internal'

export const match: {
  <A, B, C = B>(
    matchers: Option.Matchers<A, B, C>,
  ): (self: AsyncOption<A>) => Async<B | C>
} = _AsyncOption.match
