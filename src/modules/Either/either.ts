import { HKT } from "../../types/HKT"

export interface EitherHKT extends HKT {
  readonly type: Either<this["_E"], this["_A"]>
}

export type Either<E, A> = Left<E> | Right<A>

export interface Left<E> {
  readonly _tag: "Left"
  readonly value: E
}

export interface Right<A> {
  readonly _tag: "Right"
  readonly value: A
}

export const left: {
  <E = never, A = never>(e: E): Either<E, A>
} = value => ({
  _tag: "Left",
  value,
})

export const right: {
  <E = never, A = never>(a: A): Either<E, A>
} = value => ({
  _tag: "Right",
  value,
})
