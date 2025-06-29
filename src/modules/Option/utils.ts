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
  <A>(fa: Option<A>): fa is Some<A>
} = fa => fa._tag === "Some"

export const isNone: {
  <A>(fa: Option<A>): fa is None
} = fa => fa._tag === "None"

export const fromSome: {
  <A>(fa: Some<A>): A
} = fa => fa.value

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

export const fromOption: {
  <A>(a: A): (fa: Option<A>) => A
} = a => fa => isNone (fa) ? a : fromSome (fa)

export const fromEither: {
  <_, A>(ma: E.Either<_, A>): Option<A>
} = E.match (zero, some)
