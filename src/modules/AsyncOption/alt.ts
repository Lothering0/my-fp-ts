import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import { AsyncOption, AsyncOptionHkt } from './async-option'
import { _AsyncOption } from './_internal'
import { LazyArg } from '../../types/utils'

export const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(self: AsyncOption<A>) => Async.Async<A | B>
} = _AsyncOption.getOrElse

export const orElse: {
  <B>(that: AsyncOption<B>): <A>(self: AsyncOption<A>) => AsyncOption<A | B>
} = _AsyncOption.orElse

/** Lazy version of `orElse` */
export const catchAll: {
  <B>(
    that: LazyArg<AsyncOption<B>>,
  ): <A>(self: AsyncOption<A>) => AsyncOption<A | B>
} = _AsyncOption.catchAll

export const Alt: Alt_.Alt<AsyncOptionHkt> = _AsyncOption.Alt
