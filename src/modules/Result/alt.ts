import * as Alt_ from '../../typeclasses/Alt'
import { identity } from '../Identity'
import { Result, ResultHkt, succeed } from './result'
import { match } from './matchers'
import { constant } from '../../utils/constant'

export const getOrElse: {
  <Failure, Out>(
    onFailure: (failure: Failure) => Out,
  ): <In>(self: Result<Failure, In>) => In | Out
} = onFailure =>
  match({
    onFailure,
    onSuccess: identity,
  })

export const orElse: {
  <Failure, Out>(
    onFailure: Result<Failure, Out>,
  ): <In>(self: Result<unknown, In>) => Result<Failure, In | Out>
} = onFailure =>
  match({
    onFailure: constant(onFailure),
    onSuccess: succeed,
  })

export const catchAll: {
  <Failure1, Failure2, Out>(
    onFailure: (failure: Failure1) => Result<Failure2, Out>,
  ): <In>(self: Result<Failure1, In>) => Result<Failure2, In | Out>
} = onFailure =>
  match({
    onFailure,
    onSuccess: succeed,
  })

export const Alt: Alt_.Alt<ResultHkt> = {
  orElse,
}
