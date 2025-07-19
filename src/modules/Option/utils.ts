import * as R from "../Result"
import { none, Option, some, Some } from "./option"
import { LazyArg } from "../../types/utils"
import { flow, pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { isNone } from "./refinements"
import { zero } from "./alternative"

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

export const fromResult: {
  <_, A>(ma: R.Result<_, A>): Option<A>
} = R.match (zero, some)

export const toResult: {
  <E, A>(onNone: LazyArg<E>): (option: Option<A>) => R.Result<E, A>
  <E, A>(option: Option<A>, onNone: LazyArg<E>): R.Result<E, A>
} = overload (
  1,
  <E, A>(option: Option<A>, onNone: LazyArg<E>): R.Result<E, A> =>
    match<A, R.Result<E, A>> (option, flow (onNone, R.failure), R.success),
)
