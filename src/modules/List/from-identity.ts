import * as List from './list'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { _cons } from './_internal'

export const of = <A>(a: A): List.NonEmpty<A> => _cons(a)

export const FromIdentity: FromIdentity_<List.Hkt> = {
  of,
}

export const NonEmptyFromIdentity: FromIdentity_<List.NonEmptyHkt> = {
  of,
}
