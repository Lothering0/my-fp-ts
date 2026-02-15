import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { AsyncOption, Hkt } from './async-option'
import { _AsyncOption } from './_internal'

export const FromIdentity: FromIdentity_<Hkt> = _AsyncOption.FromIdentity

export const of: {
  <A>(a: A): AsyncOption<A>
} = FromIdentity.of
