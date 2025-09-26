import * as alt from '../../typeclasses/Alt'
import * as async from '../Async'
import * as asyncOption from './async-option'
import * as option from '../Option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <Out>(
    onNone: LazyArg<Out>,
  ): <In>(self: asyncOption.AsyncOption<In>) => async.Async<In | Out>
} = onNone => match({ onNone, onSome: identity })

export const orElse =
  <Out>(that: asyncOption.AsyncOption<Out>) =>
  <In>(self: asyncOption.AsyncOption<In>): asyncOption.AsyncOption<In | Out> =>
    async.flatMap(
      option.match({
        onNone: constant(that),
        onSome: asyncOption.some<In | Out>,
      }),
    )(self)

/** Lazy version of `orElse` */
export const catchAll =
  <Out>(that: LazyArg<asyncOption.AsyncOption<Out>>) =>
  <In>(self: asyncOption.AsyncOption<In>): asyncOption.AsyncOption<In | Out> =>
    async.flatMap(
      option.match({ onNone: that, onSome: asyncOption.some<In | Out> }),
    )(self)

export const Alt: alt.Alt<asyncOption.AsyncOptionHkt> = {
  orElse,
}
