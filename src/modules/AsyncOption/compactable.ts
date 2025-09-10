import * as option from "../Option"
import * as result from "../Result"
import { createCompactable } from "../../typeclasses/Compactable"
import { AsyncOption, AsyncOptionHkt, some, toPromise } from "./async-option"
import { Functor } from "./functor"
import { pipe } from "../../utils/flow"
import { flatMap } from "./monad"
import { zero } from "./alternative"

export const Compactable = createCompactable<AsyncOptionHkt> (Functor, {
  compact: self => () => toPromise (self).then (option.compact),
  separate: self =>
    pipe (
      self,
      toPromise,
      ma => () => ma,
      mma => [
        pipe (mma, flatMap (result.match ({ onFailure: some, onSuccess: zero }))),
        pipe (mma, flatMap (result.match ({ onFailure: zero, onSuccess: some }))),
      ],
    ),
})

export const compact: {
  <A>(self: AsyncOption<option.Option<A>>): AsyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: AsyncOption<result.Result<unknown, A>>): AsyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: AsyncOption<result.Result<E, A>>,
  ): readonly [AsyncOption<E>, AsyncOption<A>]
} = Compactable.separate
