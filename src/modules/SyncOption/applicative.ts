import { create } from '../../typeclasses/Applicative'
import { SyncOptionHkt, SyncOption } from './sync-option'
import { Monad } from './monad'

export const Applicative = create<SyncOptionHkt>(Monad)

export const apply: {
  <A>(fa: SyncOption<A>): <B>(self: SyncOption<(a: A) => B>) => SyncOption<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: SyncOption<(a: A) => B>): (self: SyncOption<A>) => SyncOption<B>
} = Applicative.flipApply
