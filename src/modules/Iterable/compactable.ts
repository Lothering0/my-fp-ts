import * as option from "../Option"
import * as result from "../Result"
import { createCompactable } from "../../typeclasses/Compactable"
import { IterableHkt } from "./iterable"
import { Functor } from "./functor"

export const Compactable = createCompactable<IterableHkt> (Functor, {
  compact: self => ({
    *[Symbol.iterator]() {
      for (const a of self) {
        if (option.isSome (a)) {
          yield option.value (a)
        }
      }
    },
  }),
})

export const compact: {
  <A>(self: Iterable<option.Option<A>>): Iterable<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Iterable<result.Result<unknown, A>>): Iterable<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: Iterable<result.Result<E, A>>,
  ): readonly [Iterable<E>, Iterable<A>]
} = Compactable.separate
