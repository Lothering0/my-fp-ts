import { Applicative2, createApplicative2 } from "../types/Applicative"
import { Bifunctor, createBifunctor } from "../types/Bifunctor"
import { Functor2, createFunctor2 } from "../types/Functor"
import { createMonad2, Monad2 } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"
import { pipe } from "../utils/pipe"
import { overloadWithPointFree2 } from "../utils/points"

declare module "../types/Kind" {
  export interface Kind2<E, A> {
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

type LeftConstructor = <E, _>(e: E) => Either<E, _>
export const left: LeftConstructor = value => ({
  _tag: "Left",
  value,
})

type RightConstructor = <_, A>(a: A) => Either<_, A>
export const right: RightConstructor = value => ({
  _tag: "Right",
  value,
})

type IsLeft = <E, _>(ma: Either<E, _>) => ma is Left<E>
export const isLeft: IsLeft = ma => ma._tag === "Left"

type IsRight = <_, A>(ma: Either<_, A>) => ma is Right<A>
export const isRight: IsRight = ma => ma._tag === "Right"

type FromLeft = <E>(ma: Left<E>) => E
export const fromLeft: FromLeft = ma => ma.value

type FromRight = <A>(ma: Right<A>) => A
export const fromRight: FromRight = ma => ma.value

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

export const functor: Functor2<"Either"> = createFunctor2 ({
  _URI: "Either",
  pure: right,
  map: <_, A, B>(fa: Either<_, A>, f: (a: A) => B) =>
    isLeft<_, A> (fa) ? fa : pipe (fa, fromRight, f, right<_, B>),
})

export const { pure, map } = functor

export const bifunctor: Bifunctor<"Either"> = createBifunctor ({
  _URI: "Either",
  mapLeft: <E, _, B>(fa: Either<E, _>, f: (e: E) => B): Either<B, _> =>
    isRight (fa) ? fa : pipe (fa, fromLeft, f, left<B, _>),
  bimap: <E, A, B = E, C = A>(
    fa: Either<E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ) => isLeft (fa) ? mapLeft<E, C, B> (fa, f) : map<B, A, C> (fa, g),
})

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"Either"> = createApplicative2 ({
  _URI: "Either",
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
})

export const { apply } = applicative

export const monad: Monad2<"Either"> = createMonad2 (functor) ({
  _URI: "Either",
  flat: <E, A>(mma: Either<E, Either<E, A>>) =>
    isLeft (mma) ? mma : fromRight (mma),
})

export const {
  Do,
  flat,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
} = monad

type GetSemigroup = <E, A>(semigroup: Semigroup<A>) => Semigroup<Either<E, A>>
export const getMonoid: GetSemigroup = s => ({
  concat: (mx, my) =>
    isLeft (mx)
      ? isLeft (my)
        ? mx
        : my
      : isLeft (my)
        ? mx
        : right (s.concat (fromRight (mx), fromRight (my))),
})
