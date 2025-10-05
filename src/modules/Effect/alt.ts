import * as Alt_ from '../../typeclasses/Alt'
import { identity } from '../Identity'
import { Effect, EffectHkt } from './effect'
import { match } from './matchers'
import { flatMapLeft } from './monad'

export const getOrElse: {
  <B, E>(onFailure: (failure: E) => B): <A>(self: Effect<A, E>) => Effect<A | B>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse: {
  <B, E>(
    onFailure: Effect<B, E>,
  ): <A>(self: Effect<A, unknown>) => Effect<A | B, E>
} = onFailure => flatMapLeft(() => onFailure)

export const catchAll: {
  <A, B, E1, E2>(
    onFailure: (failure: E1) => Effect<B, E2>,
  ): (self: Effect<A, E1>) => Effect<A | B, E2>
} = flatMapLeft

export const Alt: Alt_.Alt<EffectHkt> = {
  orElse,
}
