import * as Result from '../Result'
import { none, Option, some, Some } from './option'
import { LazyArg } from '../../types/utils'
import { flow } from '../../utils/flow'
import { zero } from './alternative'
import { constNull, constUndefined, constVoid } from '../../utils/constant'
import { identity } from '../Identity'
import { isNull, isUndefined } from '../../utils/typeChecks'
import { match } from './matchers'

export const value: {
  <A>(self: Some<A>): A
} = self => self.value

export const fromNullable: {
  <A>(a: A): Option<NonNullable<A>>
} = a => (a == null ? none : some(a))

export const fromNull = <A>(a: A): Option<Exclude<A, null>> =>
  isNull(a) ? none : some(a as Exclude<A, null>)

export const toNull: {
  <A>(self: Option<A>): A | null
} = match({
  onNone: constNull,
  onSome: identity,
})

export const fromUndefined = <A>(a: A): Option<Exclude<A, undefined>> =>
  isUndefined(a) ? none : some(a as Exclude<A, undefined>)

export const toUndefined: {
  <A>(self: Option<A>): A | undefined
} = match({
  onNone: constUndefined,
  onSome: identity,
})

export const fromVoid = <A>(a: A): Option<Exclude<A, void>> =>
  fromUndefined(a as Exclude<A, void>)

export const toVoid: {
  <A>(self: Option<A>): A | void
} = match({
  onNone: constVoid,
  onSome: identity,
})

export const fromResult: {
  <E, A>(ma: Result.Result<E, A>): Option<A>
} = Result.match({ onFailure: zero, onSuccess: some })

export const toResult: {
  <E>(onNone: LazyArg<E>): <A>(self: Option<A>) => Result.Result<E, A>
} = onNone =>
  match({
    onNone: flow(onNone, Result.fail),
    onSome: Result.succeed,
  })
