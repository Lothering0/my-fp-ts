import { SyncHkt, Sync } from './sync'
import { create } from '../../typeclasses/Applicative'
import { Monad } from './monad'

export const Applicative = create<SyncHkt>(Monad)

export const apply: {
  <A>(fa: Sync<A>): <B>(self: Sync<(a: A) => B>) => Sync<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: Sync<(a: A) => B>): (self: Sync<A>) => Sync<B>
} = Applicative.flipApply
