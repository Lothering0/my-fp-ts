import * as Option from '../Option'
import { Applicative as Applicative_ } from '../../typeclasses/Applicative'
import { AsyncOptionHkt, toPromise, AsyncOption } from './async-option'
import { pipe } from '../../utils/flow'
import { flip } from '../../utils/flip'
import { _AsyncOption } from './_internal'

export const Applicative: Applicative_<AsyncOptionHkt> =
  _AsyncOption.Applicative

export const apply: {
  <A>(
    asyncOption: AsyncOption<A>,
  ): <B>(selfAsyncOption: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = Applicative.apply

export const applyConcurrently: {
  <A>(
    asyncOption: AsyncOption<A>,
  ): <B>(selfAsyncOption: AsyncOption<(a: A) => B>) => AsyncOption<B>
} = asyncOption => selfAsyncOption => () =>
  Promise.all([toPromise(selfAsyncOption), toPromise(asyncOption)]).then(
    ([mab, ma]) =>
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
  ): (asyncOption: AsyncOption<A>) => AsyncOption<B>
} = Applicative.flipApply

export const flipApplyConcurrently: {
  <A, B>(
    fab: AsyncOption<(a: A) => B>,
  ): (asyncOption: AsyncOption<A>) => AsyncOption<B>
} = flip(applyConcurrently) as typeof flipApplyConcurrently
