import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { EffectHkt, Effect, fail } from './effect'

export const FromIdentityLeft: FromIdentityLeft_<EffectHkt> = {
  ofLeft: fail,
}

export const ofLeft: {
  <E>(e: E): Effect<never, E>
} = FromIdentityLeft.ofLeft
