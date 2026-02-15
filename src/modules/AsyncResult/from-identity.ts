import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Hkt, AsyncResult } from './async-result'
import { _AsyncResult } from './_internal'

export const FromIdentity: FromIdentity_<Hkt> = _AsyncResult.FromIdentity

export const of: {
  <A>(a: A): AsyncResult<A>
} = FromIdentity.of
