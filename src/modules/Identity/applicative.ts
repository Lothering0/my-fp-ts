import { overload } from "../../utils/overloads"
import { createApplicative } from "../../types/Applicative"
import { Functor } from "./functor"
import { Identity, IdentityHKT, identity } from "./identity"

export const Applicative = createApplicative<IdentityHKT> ({
  ...Functor,
  of: identity,
  ap: overload (1, (ab, a) => ab (a)),
})

export const of: {
  <A>(a: A): Identity<A>
} = Applicative.of

export const ap: {
  <A, B>(fa: Identity<A>): (self: Identity<(a: A) => B>) => Identity<B>
  <A, B>(self: Identity<(a: A) => B>, fa: Identity<A>): Identity<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply: {
  <A, B>(fa: Identity<A>): (self: Identity<(a: A) => B>) => Identity<B>
  <A, B>(self: Identity<(a: A) => B>, fa: Identity<A>): Identity<B>
} = Applicative.apply

export const flap: {
  <A, B>(fab: Identity<(a: A) => B>): (self: Identity<A>) => Identity<B>
  <A, B>(self: Identity<A>, fab: Identity<(a: A) => B>): Identity<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply: {
  <A, B>(fab: Identity<(a: A) => B>): (self: Identity<A>) => Identity<B>
  <A, B>(self: Identity<A>, fab: Identity<(a: A) => B>): Identity<B>
} = Applicative.flipApply
