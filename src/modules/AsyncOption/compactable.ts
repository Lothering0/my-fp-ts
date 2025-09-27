import * as Option from '../Option'
import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { AsyncOption, AsyncOptionHkt, some, toPromise } from './async-option'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { flatMap } from './monad'
import { zero } from './alternative'

export const Compactable = create<AsyncOptionHkt>(Functor, {
  compact: self => () => toPromise(self).then(Option.compact),
  separate: self =>
    pipe(
      self,
      toPromise,
      ma => () => ma,
      mma => [
        pipe(mma, flatMap(Result.match({ onFailure: zero, onSuccess: some }))),
        pipe(mma, flatMap(Result.match({ onFailure: some, onSuccess: zero }))),
      ],
    ),
})

export const compact: {
  <A>(self: AsyncOption<Option.Option<A>>): AsyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: AsyncOption<Result.Result<A, unknown>>): AsyncOption<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: AsyncOption<Result.Result<A, E>>,
  ): readonly [AsyncOption<A>, AsyncOption<E>]
} = Compactable.separate
