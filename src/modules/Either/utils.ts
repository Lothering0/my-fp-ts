import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { Either, left, Left, right, Right } from "./either"

export const isLeft: {
  <E>(self: Either<E, unknown>): self is Left<E>
} = self => self._tag === "Left"

export const isRight: {
  <A>(self: Either<unknown, A>): self is Right<A>
} = self => self._tag === "Right"

export const fromLeft: {
  <E>(self: Left<E>): E
} = self => self.value

export const fromRight: {
  <A>(self: Right<A>): A
} = self => self.value

export const toUnion: {
  <E, A>(self: Either<E, A>): E | A
} = self => self.value

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

export const swap = <E, A>(self: Either<E, A>): Either<A, E> =>
  match<E, A, Either<A, E>> (self, right, left)
