import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { IterableHkt } from './iterable'

export const FromIdentity: FromIdentity_<IterableHkt> = {
  of: a => ({
    *[Symbol.iterator]() {
      yield a
    },
  }),
}

export const of: {
  <A>(a: A): Iterable<A>
} = FromIdentity.of
