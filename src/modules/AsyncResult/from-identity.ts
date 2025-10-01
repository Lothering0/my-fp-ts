import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { AsyncResultHkt, AsyncResult, succeed } from './async-result'

export const FromIdentity: FromIdentity_<AsyncResultHkt> = {
  of: succeed,
}

export const of: {
  <A>(a: A): AsyncResult<A>
} = FromIdentity.of
