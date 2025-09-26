import { Hkt } from '../../typeclasses/Hkt'

export interface ResultHkt extends Hkt {
  readonly Type: Result<this['Collectable'], this['In']>
}

export type Result<E, A> = Failure<E> | Success<A>

export interface Failure<E> {
  readonly _id: 'Result'
  readonly _tag: 'Failure'
  readonly failure: E
}

export interface Success<A> {
  readonly _id: 'Result'
  readonly _tag: 'Success'
  readonly success: A
}

export const fail: {
  <Failure>(e: Failure): Result<Failure, never>
} = value => ({
  _id: 'Result',
  _tag: 'Failure',
  failure: value,
})

export const succeed: {
  <Success>(a: Success): Result<never, Success>
} = value => ({
  _id: 'Result',
  _tag: 'Success',
  success: value,
})
