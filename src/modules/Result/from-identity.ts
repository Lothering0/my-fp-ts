import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Result, Hkt, succeed } from './result'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: succeed,
}

export const of: {
  <A>(success: A): Result<A>
} = FromIdentity.of
