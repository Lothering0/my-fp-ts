import * as S from "../types/Show"
import * as E from "../types/Eq"
import { LazyArg } from "../types/utils"
import { overload } from "../utils/overloads"

export const not: {
  <B extends boolean>(b: B): B extends true ? false : true
} = <B>(b: B) => !b as B extends true ? false : true

export const match: {
  <A>(onFalse: LazyArg<A>, onTrue: LazyArg<A>): (self: boolean) => A
  <A>(self: boolean, onFalse: LazyArg<A>, onTrue: LazyArg<A>): A
} = overload (2, (x, onFalse, onTrue) => x ? onTrue () : onFalse ())

export const show: {
  <B extends boolean>(self: B): `${B}`
} = self => `${self}`

export const Show: S.Show<boolean> = { show }

export const Eq: E.Eq<boolean> = E.EqStrict

export const { equals } = Eq
