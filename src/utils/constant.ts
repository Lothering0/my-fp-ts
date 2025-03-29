type Constant = <A>(a: A) => (_: unknown) => A
export const constant: Constant = a => _ => a
