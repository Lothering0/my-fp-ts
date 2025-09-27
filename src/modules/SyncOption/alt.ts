import * as Alt_ from '../../typeclasses/Alt'
import { SyncOption, SyncOptionHkt, some } from './sync-option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <Out>(onNone: LazyArg<Out>): <In>(self: SyncOption<In>) => In | Out
} = onNone =>
  match({
    onNone,
    onSome: identity,
  })

export const orElse: {
  <Out>(
    that: SyncOption<Out>,
  ): <In>(self: SyncOption<In>) => SyncOption<In | Out>
} = that =>
  match({
    onNone: constant(that),
    onSome: some,
  })

/** Lazy version of `orElse` */
export const catchAll: {
  <Out>(
    that: LazyArg<SyncOption<Out>>,
  ): <In>(self: SyncOption<In>) => SyncOption<In | Out>
} = that =>
  match({
    onNone: that,
    onSome: some,
  })

export const Alt: Alt_.Alt<SyncOptionHkt> = {
  orElse,
}
