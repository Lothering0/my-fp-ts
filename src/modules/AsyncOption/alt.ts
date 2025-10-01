import * as Alt_ from '../../typeclasses/Alt'
import * as Async from '../Async'
import * as AsyncOption from './async-option'
import * as Option from '../Option'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <B>(
    onNone: LazyArg<B>,
  ): <A>(self: AsyncOption.AsyncOption<A>) => Async.Async<A | B>
} = onNone => match({ onNone, onSome: identity })

export const orElse =
  <B>(that: AsyncOption.AsyncOption<B>) =>
  <A>(self: AsyncOption.AsyncOption<A>): AsyncOption.AsyncOption<A | B> =>
    Async.flatMap(
      Option.match({
        onNone: constant(that),
        onSome: AsyncOption.some<A | B>,
      }),
    )(self)

/** Lazy version of `orElse` */
export const catchAll =
  <B>(that: LazyArg<AsyncOption.AsyncOption<B>>) =>
  <A>(self: AsyncOption.AsyncOption<A>): AsyncOption.AsyncOption<A | B> =>
    Async.flatMap(
      Option.match({ onNone: that, onSome: AsyncOption.some<A | B> }),
    )(self)

export const Alt: Alt_.Alt<AsyncOption.AsyncOptionHkt> = {
  orElse,
}
