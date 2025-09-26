import * as option from "../Option"
import { Async } from "../Async"
import { LazyArg } from "../../types/utils"
import { toPromise, AsyncOption } from "./async-option"

export interface Matchers<In, Out1, Out2 = Out1> {
  readonly onNone: LazyArg<Out1>
  readonly onSome: (a: In) => Out2
}

export const match: {
  <In, Out1, Out2 = Out1>(
    matchers: Matchers<In, Out1, Out2>,
  ): (self: AsyncOption<In>) => Async<Out1 | Out2>
} = matchers => self => () => toPromise (self).then (option.match (matchers))
