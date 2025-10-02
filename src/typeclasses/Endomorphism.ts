import { Semigroup } from './Semigroup'
import { Monoid } from './Monoid'
import { identity, compose } from '../modules/Identity'
import { curry } from '../utils/currying'

export interface Endomorphism<In> {
  (a: In): In
}

export const empty = identity

export const getComposeSemigroup = <In>(): Semigroup<Endomorphism<In>> => ({
  combine: curry(compose),
})

export const getComposeMonoid = <In>(): Monoid<Endomorphism<In>> => ({
  ...getComposeSemigroup(),
  empty,
})
