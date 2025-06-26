import * as T from "../Task"
import * as O from "../Option"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { fromTaskOption, none, TaskOption } from "./task-option"

type Zero = <A = never>() => TaskOption<A>
export const zero: Zero = () => none

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

export const match: Match = overload (2, matchPointed)
