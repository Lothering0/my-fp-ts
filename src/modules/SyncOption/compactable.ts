import * as option from '../Option'
import * as result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { SyncOption, SyncOptionHkt, execute, none, some } from './sync-option'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'
import { zero } from './alternative'

export const Compactable = create<SyncOptionHkt>(Functor, {
  compact: self => () => pipe(self, execute, option.compact),
  separate: self =>
    pipe(
      self,
      execute,
      option.match({
        onNone: () => [none, none],
        onSome: ma => [
          pipe(ma, result.match({ onFailure: some, onSuccess: zero })),
          pipe(ma, result.match({ onFailure: zero, onSuccess: some })),
        ],
      }),
    ),
})

export const compact: {
  <A>(self: SyncOption<option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<result.Result<unknown, A>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: SyncOption<result.Result<E, A>>,
  ): readonly [SyncOption<E>, SyncOption<A>]
} = Compactable.separate
