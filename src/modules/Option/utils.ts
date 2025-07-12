import * as R from "../Result"
import { none, Option, some, Some } from "./option"
import { LazyArg } from "../../types/utils"
import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { constant } from "../../utils/constant"
import { identity } from "../Identity"
import { isNone } from "./refinements"

export const zero: {
  <A = never>(): Option<A>
} = constant (none)

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
  <A>(onNone: LazyArg<A>): (self: Option<A>) => A
  <A>(self: Option<A>, onNone: LazyArg<A>): A
} = overload (1, <A>(self: Option<A>, onNone: LazyArg<A>) =>
  match (self, onNone, identity),
)

export const getOrElseW: {
  <A, B>(onNone: LazyArg<B>): (self: Option<A>) => A | B
  <A, B>(self: Option<A>, onNone: LazyArg<B>): A | B
} = getOrElse

export const orElse: {
  <A, B>(that: LazyArg<Option<B>>): (self: Option<A>) => Option<A | B>
  <A, B>(self: Option<A>, that: LazyArg<Option<B>>): Option<A | B>
} = overload (1, (self, that) => match (self, that, some))

export const fromResult: {
  <_, A>(ma: R.Result<_, A>): Option<A>
} = R.match (zero, some)
