import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { AsyncOption, AsyncOptionHkt, some } from './async-option'

export const FromIdentity: FromIdentity_<AsyncOptionHkt> = {
  of: some,
}

export const of: {
  <A>(a: A): AsyncOption<A>
} = FromIdentity.of
