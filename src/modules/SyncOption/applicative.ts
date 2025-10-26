import { Applicative as Applicative_ } from '../../typeclasses/Applicative'
import { SyncOptionHkt, SyncOption } from './sync-option'
import { _SyncOption } from './_internal'

export const Applicative: Applicative_<SyncOptionHkt> = _SyncOption.Applicative

export const apply: {
  <A>(fa: SyncOption<A>): <B>(self: SyncOption<(a: A) => B>) => SyncOption<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(fab: SyncOption<(a: A) => B>): (self: SyncOption<A>) => SyncOption<B>
} = Applicative.flipApply
