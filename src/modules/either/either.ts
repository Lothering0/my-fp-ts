import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly Either: Either<E, A>
  }
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

type LeftConstructor = <E>(e: E) => Either<E, never>
export const left: LeftConstructor = value => ({
  _tag: "Left",
  value,
})

type RightConstructor = <A>(a: A) => Either<never, A>
export const right: RightConstructor = value => ({
  _tag: "Right",
  value,
})

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

interface EitherEliminatorPointed {
  <E, A, B>(ma: Either<E, A>, whenLeft: (e: E) => B, whenRight: (a: A) => B): B
}

interface EitherEliminator extends EitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (ma: Either<E, A>) => B
}

const eitherPointed: EitherEliminatorPointed = (ma, whenLeft, whenRight) =>
  isLeft (ma) ? whenLeft (fromLeft (ma)) : whenRight (fromRight (ma))

export const either: EitherEliminator = overloadWithPointFree2 (eitherPointed)
