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
          yield Option.valueOf(a)
        }
      }
    },
  }),
})

export const compact: {
  <A>(self: Iterable<Option.Option<A>>): Iterable<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Iterable<Result.Result<A, unknown>>): Iterable<A>
} = Compactable.compactResults

export const separate: {
  <A, E>(
    self: Iterable<Result.Result<A, E>>,
  ): readonly [Iterable<A>, Iterable<E>]
} = Compactable.separate
