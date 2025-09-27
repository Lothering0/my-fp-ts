import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import * as AsyncOption from './async-option'
import * as Option from '../Option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <Out>(
    onNone: LazyArg<Out>,
  ): <In>(self: AsyncOption.AsyncOption<In>) => Async.Async<In | Out>
} = onNone => match({ onNone, onSome: identity })

export const orElse =
  <Out>(that: AsyncOption.AsyncOption<Out>) =>
  <In>(self: AsyncOption.AsyncOption<In>): AsyncOption.AsyncOption<In | Out> =>
    Async.flatMap(
      Option.match({
        onNone: constant(that),
        onSome: AsyncOption.some<In | Out>,
      }),
    )(self)

/** Lazy version of `orElse` */
export const catchAll =
  <Out>(that: LazyArg<AsyncOption.AsyncOption<Out>>) =>
  <In>(self: AsyncOption.AsyncOption<In>): AsyncOption.AsyncOption<In | Out> =>
    Async.flatMap(
      Option.match({ onNone: that, onSome: AsyncOption.some<In | Out> }),
    )(self)

export const Alt: Alt_.Alt<AsyncOption.AsyncOptionHkt> = {
  orElse,
}
