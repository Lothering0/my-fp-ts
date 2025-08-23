import { Prettify } from "./utils"

export type DoObjectKey = string

export type DoObject<N extends DoObjectKey, In, Out> = Prettify<{
  readonly [K in N | keyof In]: K extends keyof In ? In[K] : Out
}>
