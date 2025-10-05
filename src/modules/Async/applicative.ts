import { create } from '../../typeclasses/Applicative'
import { flip } from '../../utils/flip'
import { AsyncHkt, toPromise, Async } from './async'
import { Monad } from './monad'

export const Applicative = create<AsyncHkt>(Monad)

export const apply: {
  <A>(fa: Async<A>): <B>(self: Async<(a: A) => B>) => Async<B>
} = Applicative.apply

export const applyConcurrently: {
  <A>(fa: Async<A>): <B>(self: Async<(a: A) => B>) => Async<B>
} = fa => self => () =>
  Promise.all([toPromise(self), toPromise(fa)]).then(([f, a]) => f(a))

export const flipApply: {
  <A, B>(fab: Async<(a: A) => B>): (self: Async<A>) => Async<B>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B>(fab: Async<(a: A) => B>): (self: Async<A>) => Async<B>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
