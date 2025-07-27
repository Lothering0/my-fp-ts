import * as show_ from "../types/Show"
import * as eq from "../types/Eq"
import { LazyArg } from "../types/utils"

export const not: {
  <B extends boolean>(b: B): B extends true ? false : true
} = <B>(b: B) => !b as B extends true ? false : true

export const match: {
  <A>(onFalse: LazyArg<A>, onTrue: LazyArg<A>): (self: boolean) => A
} = (onFalse, onTrue) => self => self ? onTrue () : onFalse ()

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

export const Show: show_.Show<boolean> = { show }

export const Eq: eq.Eq<boolean> = eq.EqStrict

export const { equals } = Eq
