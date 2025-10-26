import * as Alt_ from '../../typeclasses/Alt'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { _SyncOption } from './_internal'

export const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(self: SyncOption<A>) => A | B
} = onNone =>
  match({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <B>(that: SyncOption<B>): <A>(self: SyncOption<A>) => SyncOption<A | B>
} = _SyncOption.orElse

/** Lazy version of `orElse` */
export const catchAll: {
  <B>(
    that: LazyArg<SyncOption<B>>,
  ): <A>(self: SyncOption<A>) => SyncOption<A | B>
} = _SyncOption.catchAll

export const Alt: Alt_.Alt<SyncOptionHkt> = _SyncOption.Alt
