type BooleanEliminator = <A>(
  whenFalse: () => A,
  whenTrue: () => A,
) => (x: boolean) => A
export const boolean: BooleanEliminator = (f, g) => x => x ? g () : f ()
