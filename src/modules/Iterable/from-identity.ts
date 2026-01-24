import * as Iterable from './iterable'
import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { maybeNonEmpty } from './_internal'

export const of: {
  <A>(a: A): Iterable.NonEmpty<A>
} = a =>
  maybeNonEmpty({
    *[Symbol.iterator]() {
      yield a
    },
  })

export const FromIdentity: FromIdentity_<Iterable.Hkt> = {
  of,
}

export const NonEmptyFromIdentity: FromIdentity_<Iterable.NonEmptyHkt> = {
  of,
}
