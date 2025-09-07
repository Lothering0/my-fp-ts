import * as option from "../Option"
import * as result from "../Result"
import * as separated from "../Separated"
import * as compactable from "../../typeclasses/Compactable"
import { AsyncOption, AsyncOptionHkt, toPromise, some } from "./async-option"
import { zero } from "./alternative"
import { flatMap } from "./monad"
import { flow, pipe } from "../../utils/flow"

export const Compactable: compactable.Compactable<AsyncOptionHkt> = {
  compact: self => () => toPromise (self).then (option.compact),
  compactResults: self => () => toPromise (self).then (option.compactResults),
  separate: flow (
    toPromise,
    ma => () => ma,
    mma =>
      separated.make (
        pipe (mma, flatMap (result.match ({ onFailure: some, onSuccess: zero }))),
        pipe (mma, flatMap (result.match ({ onFailure: zero, onSuccess: some }))),
      ),
  ),
}

export const compact: {
  <A>(self: AsyncOption<option.Option<A>>): AsyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: AsyncOption<result.Result<unknown, A>>): AsyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: AsyncOption<result.Result<E, A>>,
  ): separated.Separated<AsyncOption<E>, AsyncOption<A>>
} = Compactable.separate
