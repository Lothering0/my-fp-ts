export type DoObject<N extends string | number | symbol, A, B> = {
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}
