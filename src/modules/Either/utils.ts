import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { Either, left, Left, right, Right } from "./either"

export const isLeft: {
  <E>(ma: Either<E, unknown>): ma is Left<E>
} = ma => ma._tag === "Left"

export const isRight: {
  <A>(ma: Either<unknown, A>): ma is Right<A>
} = ma => ma._tag === "Right"

export const fromLeft: {
  <E>(ma: Left<E>): E
} = ma => ma.value

export const fromRight: {
  <A>(ma: Right<A>): A
} = ma => ma.value

export const toUnion: {
  <E, A>(ma: Either<E, A>): E | A
} = ma => ma.value

export const match: {
  <E, A, B>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): (self: Either<E, A>) => B
  <E, A, B>(self: Either<E, A>, onLeft: (e: E) => B, onRight: (a: A) => B): B
} = overload (
  2,
  <E, A, B>(self: Either<E, A>, onLeft: (e: E) => B, onRight: (a: A) => B) =>
    isLeft (self)
      ? pipe (self, fromLeft, onLeft)
      : pipe (self, fromRight, onRight),
)

export const swap = <E, A>(ma: Either<E, A>): Either<A, E> =>
  match<E, A, Either<A, E>> (ma, right, left)
