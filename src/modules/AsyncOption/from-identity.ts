import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './_internal'

export const FromIdentity: FromIdentity_<AsyncOptionHkt> =
  _AsyncOption.FromIdentity

export const of: {
  <A>(a: A): AsyncOption<A>
} = FromIdentity.of
