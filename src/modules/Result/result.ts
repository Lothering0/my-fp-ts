import { Hkt } from "../../types/Hkt"

export interface ResultHkt extends Hkt {
  readonly type: Result<this["_collectable"], this["_in"]>
}

export type Result<E, A> = Failure<E> | Success<A>

export interface Failure<E> {
  readonly _tag: "Failure"
  readonly failure: E
}

export interface Success<A> {
  readonly _tag: "Success"
  readonly success: A
}

export const fail: {
  <E>(e: E): Result<E, never>
} = value => ({
  _tag: "Failure",
  failure: value,
})

export const succeed: {
  <A>(a: A): Result<never, A>
} = value => ({
  _tag: "Success",
  success: value,
})
/* export interface ResultHkt extends Hkt {
  readonly type: Result<this["_in"], this["_collectable"]>
}

export type Result<A, E = never> = Success<A> | Failure<E>

export interface Failure<E> {
  readonly _tag: "Failure"
  readonly failure: E
}

export interface Success<A> {
  readonly _tag: "Success"
  readonly success: A
}

export const fail: {
  <E>(e: E): Result<never, E>
} = value => ({
  _tag: "Failure",
  failure: value,
})

export const succeed: {
  <A>(a: A): Result<A>
} = value => ({
  _tag: "Success",
  success: value,
}) */
