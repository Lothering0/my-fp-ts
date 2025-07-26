import * as O from "../Option"
import { Async } from "../Async"
import { LazyArg } from "../../types/utils"
import { toPromise, AsyncOption } from "./async-option"

export const match: {
  <A, B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => B,
  ): (self: AsyncOption<A>) => Async<B>
} = (onNone, onSome) => self => () =>
  toPromise (self).then (O.match (onNone, onSome))
