import * as Option from '../Option'
import * as Result from '../Result'
import { create } from '../../typeclasses/Compactable'
import { IterableHkt } from './iterable'
import { Functor } from './functor'

export const Compactable = create<IterableHkt>(Functor, {
  compact: self => ({
    *[Symbol.iterator]() {
      for (const a of self) {
        if (Option.isSome(a)) {
          yield Option.value(a)
        }
      }
    },
  }),
})

export const compact: {
  <A>(self: Iterable<Option.Option<A>>): Iterable<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Iterable<Result.Result<unknown, A>>): Iterable<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: Iterable<Result.Result<E, A>>,
  ): readonly [Iterable<E>, Iterable<A>]
} = Compactable.separate
