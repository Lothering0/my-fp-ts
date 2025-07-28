import * as result from "../Result"
import { none, Option, some, Some } from "./option"
import { LazyArg } from "../../types/utils"
import { flow, pipe } from "../../utils/flow"
import { isNone } from "./refinements"
import { zero } from "./alternative"

export const fromSome: {
  <A>(self: Some<A>): A
} = self => self.value

export const match: {
  <A, B, C = B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => C,
  ): (self: Option<A>) => B | C
} = (onNone, onSome) => self =>
  isNone (self) ? onNone () : pipe (self, fromSome, onSome)

export const fromNullable: {
  <A>(a: A): Option<NonNullable<A>>
} = a => a == null ? none : some (a)

export const fromResult: {
  <_, A>(ma: result.Result<_, A>): Option<A>
} = result.match (zero, some)

export const toResult: {
  <E>(onNone: LazyArg<E>): <A>(self: Option<A>) => result.Result<E, A>
} = onNone => match (flow (onNone, result.failure), result.success)
