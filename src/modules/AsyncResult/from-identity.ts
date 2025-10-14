import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { AsyncResultHkt, AsyncResult } from './async-result'
import { _AsyncResult } from './internal'

export const FromIdentity: FromIdentity_<AsyncResultHkt> =
  _AsyncResult.FromIdentity

export const of: {
  <A>(a: A): AsyncResult<A>
} = FromIdentity.of
