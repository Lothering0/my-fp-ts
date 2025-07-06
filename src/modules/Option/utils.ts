import * as R from "../Result"
import { None, none, Option, some, Some } from "./option"
import { LazyArg } from "../../types/utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"

export const zero: {
  <A = never>(): Option<A>
} = constant (none)

export const isSome: {
  <A>(self: Option<A>): self is Some<A>
} = self => self._tag === "Some"

export const isNone: {
  <A>(self: Option<A>): self is None
} = self => self._tag === "None"

export const fromSome: {
  <A>(self: Some<A>): A
} = self => self.value

export const match: {
  <A, B>(onNone: LazyArg<B>, onSome: (a: A) => B): (self: Option<A>) => B
  <A, B>(self: Option<A>, onNone: LazyArg<B>, onSome: (a: A) => B): B
} = overload (
  2,
  <A, B>(self: Option<A>, onNone: LazyArg<B>, onSome: (a: A) => B) =>
    isNone (self) ? onNone () : pipe (self, fromSome, onSome),
)

export const toOption: {
  <A>(a: A): Option<NonNullable<A>>
} = a => a == null ? none : some (a)

export const getOrElse: {
  <A>(a: A): (self: Option<A>) => A
  <A>(self: Option<A>, a: A): A
} = overload (1, (self, a) => isNone (self) ? a : fromSome (self))

export const fromResult: {
  <_, A>(ma: R.Result<_, A>): Option<A>
} = R.match (zero, some)
