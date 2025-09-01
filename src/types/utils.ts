export type Prettify<In> = {
  [K in keyof In]: In[K]
} & {}

export interface LazyArg<Out> {
  (): Out
}

export type TheseOrAnyString<Out extends string> = Out | (string & {})

export type TheseOrAnyNumber<Out extends number> = Out | (number & {})
