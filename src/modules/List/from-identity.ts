import * as List from './list'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'

export const FromIdentity: FromIdentity_<List.ListHkt> = {
  of: a => List.cons(a),
}

export const of: {
  <A>(a: A): List.List<A>
} = FromIdentity.of
