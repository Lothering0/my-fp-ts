import { overload2 } from "../utils/overloads"

type Not = <T extends boolean>(a: T) => T extends true ? false : true
export const not: Not = <T>(a: T) => !a as T extends true ? false : true

interface BooleanEliminatorPointed {
  <A>(x: boolean, whenFalse: () => A, whenTrue: () => A): A
}

interface BooleanEliminator extends BooleanEliminatorPointed {
  <A>(whenFalse: () => A, whenTrue: () => A): (x: boolean) => A
}

const booleanEliminatorPointed: BooleanEliminatorPointed = (x, f, g) =>
  x ? g () : f ()

export const boolean: BooleanEliminator = overload2 (booleanEliminatorPointed)
