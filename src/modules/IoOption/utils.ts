import * as O from "../Option"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { LazyArg } from "../../types/utils"
import { fromIoOption, IoOption, none } from "./io-option"

type Zero = <A = never>() => IoOption<A>
export const zero: Zero = () => none

interface MatchPointed {
  <A, B>(fa: IoOption<A>, b: LazyArg<B>, f: (a: A) => B): B
}

interface Match extends MatchPointed {
  <A, B>(fa: IoOption<A>, b: LazyArg<B>, f: (a: A) => B): B
}

const matchPointed: MatchPointed = (fa, whenNone, whenSome) =>
  pipe (fa, fromIoOption, O.match (whenNone, whenSome))

export const match: Match = overload (2, matchPointed)
