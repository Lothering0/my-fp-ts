import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Tree, Hkt } from './tree'
import { make } from './utils'

export const FromIdentity: FromIdentity_<Hkt> = {
  of: make,
}

export const of: {
  <A>(a: A): Tree<A>
} = FromIdentity.of
