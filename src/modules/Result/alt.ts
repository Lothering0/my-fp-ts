import * as Alt_ from '../../typeclasses/Alt'
import { identity } from '../Identity'
import { Result, ResultHkt, succeed } from './result'
import { match } from './matchers'
import { constant } from '../../utils/constant'

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

export const catchAll: {
  <B, E1, E2>(
    onFailure: (failure: E1) => Result<B, E2>,
  ): <A>(self: Result<A, E1>) => Result<A | B, E2>
} = onFailure =>
  match({
    onFailure,
    onSuccess: succeed,
  })

export const Alt: Alt_.Alt<ResultHkt> = {
  orElse,
}
