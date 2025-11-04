import { Semigroup } from './Semigroup'
import { Monoid } from './Monoid'
import { identity, compose } from '../modules/Identity'
import { curry } from '../utils/currying'

export interface Endomorphism<S> {
  (s: S): S
}

export const empty = identity

export const getComposeSemigroup = <Fixed>(): Semigroup<
  Endomorphism<Fixed>
> => ({
  combine: curry(compose),
})

export const getComposeMonoid = <Fixed>(): Monoid<Endomorphism<Fixed>> => ({
  ...getComposeSemigroup(),
  empty,
})
