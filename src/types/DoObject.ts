import { Prettify } from "./utils"

export type DoObjectKey = string | number | symbol

export type DoObject<N extends DoObjectKey, A, B> = Prettify<{
  readonly [K in N | keyof A]: K extends keyof A ? A[K] : B
}>
