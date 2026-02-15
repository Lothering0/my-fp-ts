import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'
import { Identity, Hkt } from './identity'

export const Applicative = create<Hkt>(Monad)

export const apply: {
  <A>(a: Identity<A>): <B>(f: Identity<(a: A) => B>) => Identity<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(ab: Identity<(a: A) => B>): (a: Identity<A>) => Identity<B>
} = Applicative.flipApply
