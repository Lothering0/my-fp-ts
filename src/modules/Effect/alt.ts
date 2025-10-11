import * as Alt_ from '../../typeclasses/Alt'
import { Tag, Tagged } from '../../types/Tag'
import { pipe } from '../../utils/flow'
import { identity } from '../Identity'
import { Effect, EffectHkt, fail } from './effect'
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

export const catchTag =
  <A, B, E1 extends Tagged, E2, T extends Tag<E1>>(
    tag: T,
    // Passing to callback exactly tagged object
    onFailure: (failure: E1 extends Tagged<T> ? E1 : never) => Effect<B, E2>,
  ) =>
  (
    self: Effect<A, E1>,
    // Removing catched tag from result. Leave only uncatched
  ): Effect<A | B, (E1 extends Tagged<T> ? never : E1) | E2> =>
    pipe(
      self,
      flatMapLeft<A | B, E1, E2>(e =>
        e._tag === tag
          ? onFailure(e as E1 extends Tagged<T> ? E1 : never)
          : fail(e as E1 & E2),
      ),
    )

export const catchAll: {
  <A, B, E1, E2>(
    onFailure: (failure: E1) => Effect<B, E2>,
  ): (self: Effect<A, E1>) => Effect<A | B, E2>
} = flatMapLeft

export const Alt: Alt_.Alt<EffectHkt> = {
  orElse,
}
