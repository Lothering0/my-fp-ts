import * as Option from '../Option'
import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { SyncOption, SyncOptionHkt, execute, none, some } from './sync-option'
import { pipe } from '../../utils/flow'
import { Functor } from './functor'
import { zero } from './alternative'

export const Compactable = create<SyncOptionHkt>(Functor, {
  compact: self => () => pipe(self, execute, Option.compact),
  separate: self =>
    pipe(
      self,
      execute,
      Option.match({
        onNone: () => [none, none],
        onSome: ma => [
          pipe(ma, Result.match({ onFailure: some, onSuccess: zero })),
          pipe(ma, Result.match({ onFailure: zero, onSuccess: some })),
        ],
      }),
    ),
})

export const compact: {
  <A>(self: SyncOption<Option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<Result.Result<unknown, A>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: SyncOption<Result.Result<E, A>>,
  ): readonly [SyncOption<E>, SyncOption<A>]
} = Compactable.separate
