import * as O from "../Option"
import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { AsyncOption, AsyncOptionHKT, toPromise, some } from "./async-option"
import { zero } from "./alternative"
import { flatMap } from "./monad"
import { flow, pipe } from "../../utils/flow"

export const Compactable: C.Compactable<AsyncOptionHKT> = {
  compact: self => () => toPromise (self).then (O.compact),
  compactResults: self => () => toPromise (self).then (O.compactResults),
  separate: flow (
    toPromise,
    ma => () => ma,
    mma =>
      S.make (
        pipe (mma, flatMap (R.match (some, zero))),
        pipe (mma, flatMap (R.match (zero, some))),
      ),
  ),
}

export const compact: {
  <A>(self: AsyncOption<O.Option<A>>): AsyncOption<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: AsyncOption<R.Result<unknown, A>>): AsyncOption<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: AsyncOption<R.Result<E, A>>,
  ): S.Separated<AsyncOption<E>, AsyncOption<A>>
} = Compactable.separate
