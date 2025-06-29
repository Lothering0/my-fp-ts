import * as T from "../Task"
import * as O from "../Option"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { fromTaskOption, none, TaskOption } from "./task-option"

export const zero: {
  <A = never>(): TaskOption<A>
} = () => none

export const match: {
  <A, B>(
    whenNone: LazyArg<B>,
    whenSome: (a: A) => B,
  ): (self: TaskOption<A>) => T.Task<B>
  <A, B>(
    mma: TaskOption<A>,
    whenNone: LazyArg<B>,
    whenSome: (a: A) => B,
  ): T.Task<B>
} = overload (2, (mma, f, g) => () => fromTaskOption (mma).then (O.match (f, g)))
