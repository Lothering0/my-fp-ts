import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { identity, compose } from "../modules/Identity"

export interface Endomorphism<A> {
  (a: A): A
}

export const getSemigroup = <A>(): Semigroup<Endomorphism<A>> => ({
  concat: compose,
})

export const getMonoid = <A>(): Monoid<Endomorphism<A>> => ({
  ...getSemigroup (),
  empty: identity,
})
