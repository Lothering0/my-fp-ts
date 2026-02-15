import { none, Option, some, Some } from './option'
import { constNull, constUndefined, constVoid } from '../../utils/constant'
import { identity } from '../Identity'
import { isNull, isUndefined } from '../../utils/typeChecks'
import { match } from './matchers'

export const valueOf: {
  <A>(option: Some<A>): A
} = option => option.value

export const fromNullable: {
  <A>(a: A): Option<NonNullable<A>>
} = a => (a == null ? none() : some(a))

export const fromNull = <A>(a: A): Option<Exclude<A, null>> =>
  isNull(a) ? none() : some(a as Exclude<A, null>)

export const toNull: {
  <A>(option: Option<A>): A | null
} = match({
  onNone: constNull,
  onSome: identity,
})

export const fromUndefined = <A>(a: A): Option<Exclude<A, undefined>> =>
  isUndefined(a) ? none() : some(a as Exclude<A, undefined>)

export const toUndefined: {
  <A>(option: Option<A>): A | undefined
} = match({
  onNone: constUndefined,
  onSome: identity,
})

export const fromVoid = <A>(a: A): Option<Exclude<A, void>> =>
  fromUndefined(a as Exclude<A, void>)

export const toVoid: {
  <A>(option: Option<A>): A | void
} = match({
  onNone: constVoid,
  onSome: identity,
})
