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
          pipe(ma, Result.match({ onFailure: zero, onSuccess: some })),
          pipe(ma, Result.match({ onFailure: some, onSuccess: zero })),
        ],
      }),
    ),
})

export const compact: {
  <A>(self: SyncOption<Option.Option<A>>): SyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: SyncOption<Result.Result<A, unknown>>): SyncOption<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: SyncOption<Result.Result<A, E>>,
  ): readonly [SyncOption<A>, SyncOption<E>]
} = Compactable.separate
