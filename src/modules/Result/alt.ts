import * as Alt_ from '../../typeclasses/Alt'
import { identity } from '../Identity'
import { fail, Result, ResultHkt, succeed } from './result'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { Tag, Tagged } from '../../types/Tag'
import { pipe } from '../../utils/flow'
import { flatMapLeft } from './monad-both'

export const getOrElse: {
  <B, E>(onFailure: (failure: E) => B): <A>(self: Result<A, E>) => A | B
} = onFailure =>
  match({
    onFailure,
    onSuccess: identity,
  })

export const orElse: {
  <B, E>(
    onFailure: Result<B, E>,
  ): <A>(self: Result<A, unknown>) => Result<A | B, E>
} = onFailure =>
  match({
    onFailure: constant(onFailure),
    onSuccess: succeed,
  })

export const orElseSucceed: {
  <B>(onFailure: B): <A>(self: Result<A, unknown>) => Result<A | B>
} = onFailure => orElse(succeed(onFailure))

export const orElseFail: {
  <E>(onFailure: E): <A>(self: Result<A, unknown>) => Result<A, E>
} = onFailure => orElse(fail(onFailure))

export const catchAll: {
  <B, E1, E2>(
    onFailure: (failure: E1) => Result<B, E2>,
  ): <A>(self: Result<A, E1>) => Result<A | B, E2>
} = onFailure =>
  match({
    onFailure,
    onSuccess: succeed,
  })

export const catchTag =
  <A, B, E1 extends Tagged, E2, T extends Tag<E1>>(
    tag: T,
    // Passing to callback exactly tagged object
    onFailure: (failure: E1 extends Tagged<T> ? E1 : never) => Result<B, E2>,
  ) =>
  (
    self: Result<A, E1>,
    // Removing catched tag from result. Leave only uncatched
  ): Result<A | B, (E1 extends Tagged<T> ? never : E1) | E2> =>
    pipe(
      self,
      flatMapLeft<A | B, E1, E2>(e =>
        e._tag === tag
          ? onFailure(e as E1 extends Tagged<T> ? E1 : never)
          : fail(e as E1 & E2),
      ),
    )

export const Alt: Alt_.Alt<ResultHkt> = {
  orElse,
}
