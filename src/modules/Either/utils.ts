import { pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"
import { Either, left, Left, right, Right } from "./either"

type IsLeft = <E>(ma: Either<E, unknown>) => ma is Left<E>
export const isLeft: IsLeft = ma => ma._tag === "Left"

type IsRight = <A>(ma: Either<unknown, A>) => ma is Right<A>
export const isRight: IsRight = ma => ma._tag === "Right"

type FromLeft = <E>(ma: Left<E>) => E
export const fromLeft: FromLeft = ma => ma.value

type FromRight = <A>(ma: Right<A>) => A
export const fromRight: FromRight = ma => ma.value

type ToUnion = <E, A>(ma: Either<E, A>) => E | A
export const toUnion: ToUnion = ma => ma.value

interface MatchPointed {
  <E, A, B>(ma: Either<E, A>, onLeft: (e: E) => B, onRight: (a: A) => B): B
}

interface Match extends MatchPointed {
  <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B): (ma: Either<E, A>) => B
}

const matchPointed: MatchPointed = (ma, onLeft, onRight) =>
  isLeft (ma) ? pipe (ma, fromLeft, onLeft) : pipe (ma, fromRight, onRight)

export const match: Match = overload (2, matchPointed)

export const swap = <E, A>(ma: Either<E, A>): Either<A, E> =>
  match<E, A, Either<A, E>> (ma, right, left)
