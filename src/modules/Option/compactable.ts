import * as result from "../Result"
import { createCompactable } from "../../typeclasses/Compactable"
import { Option, OptionHkt } from "./option"
import { flat } from "./monad"
import { Functor } from "./functor"

export const Compactable = createCompactable<OptionHkt> (Functor, {
  compact: flat,
})

export const compact: {
  <A>(self: Option<Option<A>>): Option<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Option<result.Result<unknown, A>>): Option<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(self: Option<result.Result<E, A>>): readonly [Option<E>, Option<A>]
} = Compactable.separate
