import { createApplicative } from "../../typeclasses/Applicative"
import { Functor } from "./functor"
import { Identity, IdentityHkt, identity } from "./identity"

export const Applicative = createApplicative<IdentityHkt> ({
  ...Functor,
  of: identity,
  ap: a => ab => ab (a),
})

export const of: {
  <A>(a: A): Identity<A>
} = Applicative.of

export const ap: {
  <A>(fa: Identity<A>): <B>(self: Identity<(a: A) => B>) => Identity<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Identity<(a: A) => B>): (self: Identity<A>) => Identity<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
