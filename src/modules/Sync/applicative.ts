import { Hkt, Sync } from './sync'
import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'

export const Applicative = create<Hkt>(Monad)

export const apply: {
  <A>(sync: Sync<A>): <B>(selfSync: Sync<(a: A) => B>) => Sync<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(sync: Sync<(a: A) => B>): (selfSync: Sync<A>) => Sync<B>
} = Applicative.flipApply
