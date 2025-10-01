import { create } from '../../typeclasses/Applicative'
import { AsyncHkt, toPromise, Async } from './async'
import { Monad } from './monad'

export const Applicative = create<AsyncHkt>(Monad, {
  apply: fa => self => () =>
    Promise.all([toPromise(self), toPromise(fa)]).then(([f, a]) => f(a)),
})

export const apply: {
  <In>(fa: Async<In>): <Out>(self: Async<(a: In) => Out>) => Async<Out>
} = Applicative.apply

export const flipApply: {
  <In, Out>(fab: Async<(a: In) => Out>): (self: Async<In>) => Async<Out>
} = Applicative.flipApply
