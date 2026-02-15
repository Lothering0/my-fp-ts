import * as Alt_ from '../../typeclasses/Alt'
import { Tag, Tagged } from '../../types/Tag'
import { pipe } from '../../utils/flow'
import { identity } from '../Identity'
import { Effect, Hkt, succeed, fail } from './effect'
import { match } from './matchers'
import { flatMapLeft } from './monad-both'

export const getOrElse: {
  <B, E>(
    onFailure: (failure: E) => B,
  ): <A, R>(effect: Effect<A, E, R>) => Effect<A | B, never, R>
} = onFailure => match({ onFailure, onSuccess: identity })

export const orElse: {
  <B, E, R>(
    onFailure: Effect<B, E, R>,
  ): <A>(effect: Effect<A, unknown, R>) => Effect<A | B, E, R>
} = onFailure => flatMapLeft(() => onFailure)

export const orElseSucceed: {
  <B>(
    onFailure: B,
  ): <A, R>(effect: Effect<A, unknown, R>) => Effect<A | B, never, R>
} = onFailure => orElse(succeed(onFailure))

export const orElseFail: {
  <E>(onFailure: E): <A, R>(effect: Effect<A, unknown, R>) => Effect<A, E, R>
} = onFailure => orElse(fail(onFailure))

export const catchTag =
  <A, B, R, E1 extends Tagged, E2, T extends Tag<E1>>(
    tag: T,
    // Passing to callback exactly tagged object
    onFailure: (failure: E1 extends Tagged<T> ? E1 : never) => Effect<B, E2, R>,
  ) =>
  (
    effect: Effect<A, E1, R>,
    // Removing catched tag from result. Leave only uncatched
  ): Effect<A | B, (E1 extends Tagged<T> ? never : E1) | E2, R> =>
    pipe(
      effect,
      flatMapLeft<A | B, E1, E2, R>(e =>
        e._tag === tag
          ? onFailure(e as E1 extends Tagged<T> ? E1 : never)
          : fail(e as E1 & E2),
      ),
    )

export const catchAll: {
  <A, B, E1, E2, R>(
    onFailure: (failure: E1) => Effect<B, E2, R>,
  ): (effect: Effect<A, E1, R>) => Effect<A | B, E2, R>
} = flatMapLeft

export const Alt: Alt_.Alt<Hkt> = {
  orElse,
}
