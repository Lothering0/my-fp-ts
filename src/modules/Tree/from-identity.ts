import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Tree, TreeHkt } from './tree'
import { make } from './utils'

export const FromIdentity: FromIdentity_<TreeHkt> = {
  of: make,
}

export const of: {
  <A>(a: A): Tree<A>
} = FromIdentity.of
