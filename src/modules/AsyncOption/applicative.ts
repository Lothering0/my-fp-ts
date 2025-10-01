import * as Option from '../Option'
import { create } from '../../typeclasses/Applicative'
import { AsyncOptionHkt, toPromise, AsyncOption } from './async-option'
import { pipe } from '../../utils/flow'
import { Monad } from './monad'

export const Applicative = create<AsyncOptionHkt>(Monad, {
  apply: fma => self => () =>
    Promise.all([toPromise(self), toPromise(fma)]).then(([mab, ma]) =>
      pipe(
        Option.Do,
        Option.apS('a', ma),
        Option.apS('ab', mab),
        Option.map(({ ab, a }) => ab(a)),
      ),
    ),
})

export const apply: {
  <A>(fa: AsyncOption<A>): <B>(self: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = Applicative.apply

export const flipApply: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = Applicative.flipApply
