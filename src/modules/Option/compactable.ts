import * as R from "../Result"
import * as S from "../Separated"
import * as C from "../../types/Compactable"
import { Option, OptionHKT, some } from "./option"
import { flat, flatMap } from "./monad"
import { fromResult } from "./utils"
import { zero } from "./alternative"
import { pipe } from "../../utils/flow"

export const Compactable: C.Compactable<OptionHKT> = {
  compact: flat,
  compactResults: flatMap (fromResult),
  separate: self =>
    S.make (
      pipe (self, flatMap (R.match (some, zero))),
      pipe (self, flatMap (R.match (zero, some))),
    ),
}

export const compact: {
  <A>(self: Option<Option<A>>): Option<A>
} = Compactable.compact

export const compactResults: {
  <A>(self: Option<R.Result<unknown, A>>): Option<A>
} = Compactable.compactResults

export const separate: {
  <E, A>(self: Option<R.Result<E, A>>): S.Separated<Option<E>, Option<A>>
} = Compactable.separate
