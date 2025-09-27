import { identity } from '../Identity'
import { match } from './matchers'
import { Result, fail, Failure, succeed, Success } from './result'

export const failureOf: {
  <E>(self: Failure<E>): E
} = self => self.failure

export const successOf: {
  <A>(self: Success<A>): A
} = self => self.success

export const toUnion: {
  <A, E>(self: Result<A, E>): A | E
} = match({
  onFailure: identity,
  onSuccess: identity,
})

export const swap: {
  <A, E>(self: Result<A, E>): Result<E, A>
} = match({
  onFailure: succeed,
  onSuccess: fail,
})
