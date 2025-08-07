import { Semigroup } from "./Semigroup"
import { Monoid } from "./Monoid"
import { identity, compose } from "../modules/Identity"
import { curry } from "../utils/currying"

export interface Endomorphism<A> {
  (a: A): A
}

export const empty = identity

export const getSemigroup = <A>(): Semigroup<Endomorphism<A>> => ({
  concat: curry (compose),
})

export const getMonoid = <A>(): Monoid<Endomorphism<A>> => ({
  ...getSemigroup (),
  empty,
})
