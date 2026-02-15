import { FromIdentityLeft as FromIdentityLeft_ } from '../../typeclasses/FromIdentityLeft'
import { Hkt, Effect, fail } from './effect'

export const FromIdentityLeft: FromIdentityLeft_<Hkt> = {
  ofLeft: fail,
}

export const ofLeft: {
  <E>(e: E): Effect<never, E>
} = FromIdentityLeft.ofLeft
