import * as option from '../Option'
import { create } from '../../typeclasses/Applicative'
import { AsyncOptionHkt, some, toPromise, AsyncOption } from './async-option'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'

export const Applicative = create<AsyncOptionHkt>(Functor, {
  of: some,
  ap: fma => self => () =>
    Promise.all([toPromise(self), toPromise(fma)]).then(([mab, ma]) =>
      pipe(
        option.Do,
        option.apS('a', ma),
        option.apS('ab', mab),
        option.map(({ ab, a }) => ab(a)),
      ),
    ),
})

export const of: {
  <Out>(a: Out): AsyncOption<Out>
} = Applicative.of

export const ap: {
  <In>(
    fa: AsyncOption<In>,
  ): <Out>(self: AsyncOption<(a: In) => Out>) => AsyncOption<Out>
} = Applicative.ap

/** Alias for `ap` */
export const apply = ap

export const flap: {
  <In, Out>(
    fab: AsyncOption<(a: In) => Out>,
  ): (self: AsyncOption<In>) => AsyncOption<Out>
} = Applicative.flap

/** Alias for `flap` */
export const flipApply = flap
