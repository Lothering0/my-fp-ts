import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { EffectHkt, Effect, succeed } from './effect'

export const FromIdentity: FromIdentity_<EffectHkt> = {
  of: succeed,
}

export const of: {
  <A>(a: A): Effect<A>
} = FromIdentity.of
