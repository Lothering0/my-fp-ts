import { overload2 } from "../utils/overloads"

type Not = <T extends boolean>(a: T) => T extends true ? false : true
export const not: Not = <T>(a: T) => !a as T extends true ? false : true

interface MatchPointed {
  <A>(x: boolean, whenFalse: () => A, whenTrue: () => A): A
}

interface Match extends MatchPointed {
  <A>(whenFalse: () => A, whenTrue: () => A): (x: boolean) => A
}

const matchPointed: MatchPointed = (x, f, g) => x ? g () : f ()

export const match: Match = overload2 (matchPointed)
