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
        pipe(mma, flatMap(Result.match({ onFailure: some, onSuccess: zero }))),
        pipe(mma, flatMap(Result.match({ onFailure: zero, onSuccess: some }))),
      ],
    ),
})

export const compact: {
  <Out>(self: AsyncOption<Option.Option<Out>>): AsyncOption<Out>
} = Compactable.compact

export const compactResults: {
  <Out>(self: AsyncOption<Result.Result<unknown, Out>>): AsyncOption<Out>
} = Compactable.compactResults

export const separate: {
  <Collectable, Out>(
    self: AsyncOption<Result.Result<Collectable, Out>>,
  ): readonly [AsyncOption<Collectable>, AsyncOption<Out>]
} = Compactable.separate
