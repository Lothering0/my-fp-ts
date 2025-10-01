import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Identity, IdentityHkt } from './identity'

export const Applicative = create<IdentityHkt>(Monad)

export const apply: {
  <A>(fa: Identity<A>): <B>(self: Identity<(a: A) => B>) => Identity<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: Identity<(a: A) => B>): (self: Identity<A>) => Identity<B>
} = Applicative.flipApply
