import * as O from "../Option"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { fromIoOption, IoOption, none } from "./io-option"

export const zero: {
  <A = never>(): IoOption<A>
} = () => none

export const match: {
  <A, B>(b: LazyArg<B>, f: (a: A) => B): (self: IoOption<A>) => B
  <A, B>(self: IoOption<A>, b: LazyArg<B>, f: (a: A) => B): B
} = overload (2, (fa, whenNone, whenSome) =>
  pipe (fa, fromIoOption, O.match (whenNone, whenSome)),
)
