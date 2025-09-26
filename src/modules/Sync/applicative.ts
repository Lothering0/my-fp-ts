import { Functor, map } from './functor'
import { SyncHkt, sync, execute, Sync } from './sync'
import { create } from '../../typeclasses/Applicative'
import { pipe } from '../../utils/flow'

export const Applicative = create<SyncHkt>(Functor, {
  of: sync,
  ap: fa => self => pipe(fa, map(execute(self))),
})

export const of: {
  <A>(a: A): Sync<A>
} = Applicative.of

export const ap: {
  <A>(fa: Sync<A>): <B>(self: Sync<(a: A) => B>) => Sync<B>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <A, B>(fab: Sync<(a: A) => B>): (self: Sync<A>) => Sync<B>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
