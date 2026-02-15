import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { Pipeable } from '../../utils/flow'
import { hole } from '../../utils/hole'
import { pipe } from '../_internal'

export interface Hkt extends Hkt_ {
  readonly Type: Result<this['In'], this['Collectable']>
}

export type Result<A, E = never> = (Success<A> | Failure<E>) & {
  readonly [Symbol.iterator]: ResultGenerator<A, E>
}

export interface ResultGenerator<A, E> {
  (): Generator<E, A>
}

export interface Success<A> extends Pipeable {
  readonly _id: 'Result'
  readonly _tag: 'Success'
  readonly success: A
  readonly [Symbol.iterator]: ResultGenerator<A, never>
}

export interface Failure<E> extends Pipeable {
  readonly _id: 'Result'
  readonly _tag: 'Failure'
  readonly failure: E
  readonly [Symbol.iterator]: ResultGenerator<never, E>
}

export const succeed: {
  <A, E = never>(success: A): Result<A, E>
} = success =>
  Object.freeze({
    _id: 'Result',
    _tag: 'Success',
    success: success,
    pipe,
    *[Symbol.iterator]() {
      return success
    },
  })

export const fail: {
  <E>(failure: E): Result<never, E>
} = failure =>
  Object.freeze({
    _id: 'Result',
    _tag: 'Failure',
    failure: failure,
    pipe,
    *[Symbol.iterator]() {
      yield failure
      return hole()
    },
  })

export const gen: {
  <A, E>(generator: ResultGenerator<A, E>): Result<A, E>
} = generator => {
  const { value, done } = generator().next()
  if (!done) {
    return fail(value)
  }
  return succeed(value)
}
