import * as O from "../Option"
import { Async } from "../Async"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { toPromise, AsyncOption } from "./async-option"

export const match: {
  <A, B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => B,
  ): (self: AsyncOption<A>) => Async<B>
  <A, B>(mma: AsyncOption<A>, onNone: LazyArg<B>, onSome: (a: A) => B): Async<B>
} = overload (
  2,
  (self, onNone, onSome) => () => toPromise (self).then (O.match (onNone, onSome)),
)
