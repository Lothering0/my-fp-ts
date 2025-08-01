import * as result from "../Result"
import { none, Option, some, Some } from "./option"
import { LazyArg } from "../../types/utils"
import { flow, pipe } from "../../utils/flow"
import { isNone } from "./refinements"
import { zero } from "./alternative"
import { constNull, constUndefined, constVoid } from "../../utils/constant"
import { identity } from "../Identity"
import { isNull, isUndefined } from "../../utils/typeChecks"

export const value: {
  <A>(self: Some<A>): A
} = self => self.value

export const match: {
  <A, B, C = B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => C,
  ): (self: Option<A>) => B | C
} = (onNone, onSome) => self =>
  isNone (self) ? onNone () : pipe (self, value, onSome)

export const fromNullable: {
  <A>(a: A): Option<NonNullable<A>>
} = a => a == null ? none : some (a)

export const fromNull = <A>(a: A): Option<Exclude<A, null>> =>
  isNull (a) ? none : some (a as Exclude<A, null>)

export const toNull: {
  <A>(self: Option<A>): A | null
} = match (constNull, identity)

export const fromUndefined = <A>(a: A): Option<Exclude<A, undefined>> =>
  isUndefined (a) ? none : some (a as Exclude<A, undefined>)

export const toUndefined: {
  <A>(self: Option<A>): A | undefined
} = match (constUndefined, identity)

export const fromVoid = <A>(a: A): Option<Exclude<A, void>> =>
  fromUndefined (a as Exclude<A, void>)

export const toVoid: {
  <A>(self: Option<A>): A | void
} = match (constVoid, identity)

export const fromResult: {
  <_, A>(ma: result.Result<_, A>): Option<A>
} = result.match (zero, some)

export const toResult: {
  <E>(onNone: LazyArg<E>): <A>(self: Option<A>) => result.Result<E, A>
} = onNone => match (flow (onNone, result.fail), result.succeed)
