import * as Alt_ from '../../typeclasses/Alt'
import { some, Option, Hkt } from './option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(option: Option<A>) => A | B
} = onNone =>
  match({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <B>(that: Option<B>): <A>(option: Option<A>) => Option<A | B>
} = that =>
  match({
    onNone: constant(that),
    onSome: some,
  })

export const orElseSome: {
  <B>(b: B): <A>(option: Option<A>) => Option<A | B>
} = b => orElse(some(b))

/** Lazy version of `orElse` */
export const catchAll: {
  <B>(option: LazyArg<Option<B>>): <A>(selfOption: Option<A>) => Option<A | B>
} = option =>
  match({
    onNone: option,
    onSome: some,
  })

export const Alt: Alt_.Alt<Hkt> = {
  orElse,
}
