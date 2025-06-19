import { overload2 } from "../utils/overloads"
import { LazyArg } from "../types/utils"

type Not = <T extends boolean>(a: T) => T extends true ? false : true
export const not: Not = <T>(a: T) => !a as T extends true ? false : true

interface MatchPointed {
  <A>(x: boolean, whenFalse: LazyArg<A>, whenTrue: LazyArg<A>): A
}

interface Match extends MatchPointed {
  <A>(whenFalse: LazyArg<A>, whenTrue: LazyArg<A>): (x: boolean) => A
}

const matchPointed: MatchPointed = (x, f, g) => x ? g () : f ()

export const match: Match = overload2 (matchPointed)
