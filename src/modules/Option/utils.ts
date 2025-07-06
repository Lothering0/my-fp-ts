import * as E from "../Either"
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
  <A, B>(whenNone: LazyArg<B>, whenSome: (a: A) => B): (self: Option<A>) => B
  <A, B>(self: Option<A>, whenNone: LazyArg<B>, whenSome: (a: A) => B): B
} = overload (
  2,
  <A, B>(self: Option<A>, whenNone: LazyArg<B>, whenSome: (a: A) => B) =>
    isNone (self) ? whenNone () : pipe (self, fromSome, whenSome),
)

export const toOption: {
  <A>(a: A): Option<NonNullable<A>>
} = a => a == null ? none : some (a)

export const getOrElse: {
  <A>(a: A): (self: Option<A>) => A
  <A>(self: Option<A>, a: A): A
} = overload (1, (self, a) => isNone (self) ? a : fromSome (self))

export const fromEither: {
  <_, A>(ma: E.Either<_, A>): Option<A>
} = E.match (zero, some)
