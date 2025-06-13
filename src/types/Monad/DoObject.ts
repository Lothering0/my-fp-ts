import { Prettify } from "../utils"

export type DoObject<N extends string | number | symbol, A, B> = Prettify<{
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}>
