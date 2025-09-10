import * as option from "../Option"
import * as result from "../Result"
import { createCompactable } from "../../typeclasses/Compactable"
import { ReadonlyArrayHkt } from "./readonly-array"
import { of } from "./applicative"
import { flatMap } from "./monad"
import { constEmptyArray } from "../../utils/constant"
import { Functor } from "./functor"

export const Compactable = createCompactable<ReadonlyArrayHkt> (Functor, {
  compact: flatMap (
    option.match ({
      onNone: constEmptyArray,
      onSome: of,
    }),
  ),
})

export const compact: {
  <A>(self: ReadonlyArray<option.Option<A>>): ReadonlyArray<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: ReadonlyArray<result.Result<unknown, A>>): ReadonlyArray<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: ReadonlyArray<result.Result<E, A>>,
  ): readonly [ReadonlyArray<E>, ReadonlyArray<A>]
} = Compactable.separate
