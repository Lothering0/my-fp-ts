import * as Alt_ from '../../typeclasses/Alt'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { _SyncOption } from './_internal'

export const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(syncOption: SyncOption<A>) => A | B
} = onNone =>
  match({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <B>(
    syncOption: SyncOption<B>,
  ): <A>(selfSyncOption: SyncOption<A>) => SyncOption<A | B>
} = _SyncOption.orElse

export const orElseSome: {
  <B>(b: B): <A>(syncOption: SyncOption<A>) => SyncOption<A | B>
} = _SyncOption.orElseSome

/** Lazy version of `orElse` */
export const catchAll: {
  <B>(
    syncOption: LazyArg<SyncOption<B>>,
  ): <A>(selfSyncOption: SyncOption<A>) => SyncOption<A | B>
} = _SyncOption.catchAll

export const Alt: Alt_.Alt<SyncOptionHkt> = _SyncOption.Alt
