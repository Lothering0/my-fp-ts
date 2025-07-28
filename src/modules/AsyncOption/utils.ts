import * as option from "../Option"
import { Async } from "../Async"
import { LazyArg } from "../../types/utils"
import { toPromise, AsyncOption } from "./async-option"

export const match: {
  <A, B, C = B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => C,
  ): (self: AsyncOption<A>) => Async<B | C>
} = (onNone, onSome) => self => () =>
  toPromise (self).then (option.match (onNone, onSome))
