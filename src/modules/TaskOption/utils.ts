import * as T from "../Task"
import * as O from "../Option"
import { overload2 } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { fromTaskOption, TaskOption } from "./task-option"

interface MatchPointed {
  <A, B>(
    mma: TaskOption<A>,
    whenNone: LazyArg<B>,
    whenSome: (a: A) => B,
  ): T.Task<B>
}

interface Match extends MatchPointed {
  <A, B>(
    whenNone: LazyArg<B>,
    whenSome: (a: A) => B,
  ): (mma: TaskOption<A>) => T.Task<B>
}

const matchPointed: MatchPointed = (mma, f, g) => () =>
  fromTaskOption (mma).then (O.match (f, g))

export const match: Match = overload2 (matchPointed)
