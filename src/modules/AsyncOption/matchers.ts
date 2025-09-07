import * as option from "../Option"
import { Async } from "../Async"
import { LazyArg } from "../../types/utils"
import { toPromise, AsyncOption } from "./async-option"

export interface Matchers<A, B, C = B> {
  readonly onNone: LazyArg<B>
  readonly onSome: (a: A) => C
}

export const match: {
  <A, B, C = B>(
    matchers: Matchers<A, B, C>,
  ): (self: AsyncOption<A>) => Async<B | C>
} = matchers => self => () => toPromise (self).then (option.match (matchers))
