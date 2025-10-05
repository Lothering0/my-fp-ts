import * as Option from '../Option'
import { create } from '../../typeclasses/Applicative'
import { AsyncOptionHkt, toPromise, AsyncOption } from './async-option'
import { pipe } from '../../utils/flow'
import { Monad } from './monad'
import { flip } from '../../utils/flip'

export const Applicative = create<AsyncOptionHkt>(Monad)

export const apply: {
  <A>(fa: AsyncOption<A>): <B>(self: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = Applicative.apply

export const applyConcurrently: {
  <A>(fa: AsyncOption<A>): <B>(self: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = fma => self => () =>
  Promise.all([toPromise(self), toPromise(fma)]).then(([mab, ma]) =>
    pipe(
      Option.Do,
      Option.bind('a', ma),
      Option.bind('ab', mab),
      Option.map(({ ab, a }) => ab(a)),
    ),
  )

export const flipApply: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (self: AsyncOption<A>) => AsyncOption<B>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
