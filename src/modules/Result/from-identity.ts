import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Result, ResultHkt, succeed } from './result'

export const FromIdentity: FromIdentity_<ResultHkt> = {
  of: succeed,
}

export const of: {
  <A>(success: A): Result<A>
} = FromIdentity.of
