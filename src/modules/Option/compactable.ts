import * as result from "../Result"
import * as separated from "../Separated"
import * as compactable from "../../typeclasses/Compactable"
import { Option, OptionHkt, some } from "./option"
import { flat, flatMap } from "./monad"
import { fromResult } from "./utils"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"

export const Compactable: compactable.Compactable<OptionHkt> = {
  compact: flat,
  compactResults: flatMap (fromResult),
  separate: self =>
    separated.make (
      pipe (self, flatMap (result.match (some, zero))),
      pipe (self, flatMap (result.match (zero, some))),
    ),
}

export const compact: {
  <A>(self: Option<Option<A>>): Option<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Option<result.Result<unknown, A>>): Option<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(
    self: Option<result.Result<E, A>>,
  ): separated.Separated<Option<E>, Option<A>>
} = Compactable.separate
