import { Hkt } from '../../typeclasses/Hkt'
import { hole } from '../../utils/hole'

export interface ResultHkt extends Hkt {
  readonly Type: Result<this['Collectable'], this['In']>
}

export type Result<E, A> = (Failure<E> | Success<A>) & {
  readonly [Symbol.iterator]: ResultGenerator<E, A>
}

export interface ResultGenerator<E, A> {
  (): Generator<E, A>
}

export interface Failure<E> {
  readonly _id: 'Result'
  readonly _tag: 'Failure'
  readonly failure: E
  readonly [Symbol.iterator]: ResultGenerator<E, never>
}

export interface Success<A> {
  readonly _id: 'Result'
  readonly _tag: 'Success'
  readonly success: A
  readonly [Symbol.iterator]: ResultGenerator<never, A>
}

export const fail: {
  <Failure>(failure: Failure): Result<Failure, never>
} = failure => ({
  _id: 'Result',
  _tag: 'Failure',
  failure: failure,
  *[Symbol.iterator]() {
    yield failure
    return hole()
  },
})

export const succeed: {
  <Success>(success: Success): Result<never, Success>
} = success => ({
  _id: 'Result',
  _tag: 'Success',
  success: success,
  *[Symbol.iterator]() {
    return success
  },
})

export const gen: {
  <E, A>(f: ResultGenerator<E, A>): Result<E, A>
} = f => {
  const iterator = f()
  const { value, done } = iterator.next()
  if (!done) {
    return fail(value)
  }
  return succeed(value)
}
