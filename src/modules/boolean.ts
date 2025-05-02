import { overloadWithPointFree2 } from "../utils/points"

interface BooleanEliminatorPointed {
  <A>(x: boolean, whenFalse: () => A, whenTrue: () => A): A
}

interface BooleanEliminator extends BooleanEliminatorPointed {
  <A>(whenFalse: () => A, whenTrue: () => A): (x: boolean) => A
}

const booleanEliminatorPointed: BooleanEliminatorPointed = (x, f, g) =>
  x ? g () : f ()

export const boolean: BooleanEliminator = overloadWithPointFree2 (
  booleanEliminatorPointed,
)
