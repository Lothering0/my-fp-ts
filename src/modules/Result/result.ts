import { Hkt } from "../../types/Hkt"

export interface ResultHkt extends Hkt {
  readonly type: Result<this["_E"], this["_A"]>
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
  <E = never, A = never>(e: E): Result<E, A>
} = value => ({
  _tag: "Failure",
  failure: value,
})

export const succeed: {
  <E = never, A = never>(a: A): Result<E, A>
} = value => ({
  _tag: "Success",
  success: value,
})
