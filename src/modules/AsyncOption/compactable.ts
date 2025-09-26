import * as option from '../Option'
import * as result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { AsyncOption, AsyncOptionHkt, some, toPromise } from './async-option'
import { Functor } from './functor'
import { pipe } from '../../utils/flow'
import { flatMap } from './monad'
import { zero } from './alternative'

export const Compactable = create<AsyncOptionHkt>(Functor, {
  compact: self => () => toPromise(self).then(option.compact),
  separate: self =>
    pipe(
      self,
      toPromise,
      ma => () => ma,
      mma => [
        pipe(mma, flatMap(result.match({ onFailure: some, onSuccess: zero }))),
        pipe(mma, flatMap(result.match({ onFailure: zero, onSuccess: some }))),
      ],
    ),
})

export const compact: {
  <Out>(self: AsyncOption<option.Option<Out>>): AsyncOption<Out>
} = Compactable.compact

export const compactResults: {
  <Out>(self: AsyncOption<result.Result<unknown, Out>>): AsyncOption<Out>
} = Compactable.compactResults

export const separate: {
  <Collectable, Out>(
    self: AsyncOption<result.Result<Collectable, Out>>,
  ): readonly [AsyncOption<Collectable>, AsyncOption<Out>]
} = Compactable.separate
