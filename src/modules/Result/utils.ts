import { nonEmpty, NonEmptyIterable } from '../_internal'
import { identity } from '../Identity'
import { match } from './matchers'
import { isSuccess } from './refinements'
import { Result, fail, Failure, succeed, Success } from './result'

export const failureOf: {
  <E>(result: Failure<E>): E
} = result => result.failure

export const successOf: {
  <A>(result: Success<A>): A
} = result => result.success

export const toUnion: {
  <A, E>(result: Result<A, E>): A | E
} = match({
  onFailure: identity,
  onSuccess: identity,
})

export const swap: {
  <A, E>(result: Result<A, E>): Result<E, A>
} = match({
  onFailure: succeed,
  onSuccess: fail,
})

export const toIterable: {
  <A>(result: Success<A>): NonEmptyIterable<A>
  <A>(result: Result<A, unknown>): Iterable<A>
} = result => ({
  [nonEmpty]: undefined,
  *[Symbol.iterator]() {
    if (isSuccess(result)) {
      yield result.success
    }
  },
})
