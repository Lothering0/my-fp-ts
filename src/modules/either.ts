import { Applicative2 } from "../types/Applicative"
import { Bifunctor } from "../types/Bifunctor"
import { Functor2 } from "../types/Functor"
import { createMonad2, Monad2 } from "../types/Monad"
import { Semigroup } from "../types/Semigroup"

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

type LeftConstructor = <E, A>(e: E) => Either<E, A>
export const left: LeftConstructor = value => ({
  _tag: "Left",
  value,
})

type RightConstructor = <E, A>(a: A) => Either<E, A>
export const right: RightConstructor = value => ({
  _tag: "Right",
  value,
})

type IsLeft = <E, A>(ma: Either<E, A>) => ma is Left<E>
export const isLeft: IsLeft = ma => ma._tag === "Left"

type IsRight = <E, A>(ma: Either<E, A>) => ma is Right<A>
export const isRight: IsRight = ma => ma._tag === "Right"

type FromLeft = <E>(ma: Left<E>) => E
export const fromLeft: FromLeft = ma => ma.value

type FromRight = <A>(ma: Right<A>) => A
export const fromRight: FromRight = ma => ma.value

type EitherEliminator = <E, A, B>(
  ma: Either<E, A>,
  whenLeft: (e: E) => B,
  whenRight: (a: A) => B,
) => B
export const either: EitherEliminator = (ma, whenLeft, whenRight) =>
  isLeft (ma) ? whenLeft (fromLeft (ma)) : whenRight (fromRight (ma))

export const functor: Functor2<"Either"> = {
  _URI: "Either",
  pure: right,
  map: (fa, f) => isLeft (fa) ? fa : right (f (fromRight (fa))),
}

export const { pure, map } = functor

export const bifunctor: Bifunctor<"Either"> = {
  _URI: "Either",
  mapLeft: (fa, f) => isRight (fa) ? fa : left (f (fromLeft (fa))),
  bimap: <E, A, B = E, C = A>(
    fa: Either<E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ) => isLeft (fa) ? mapLeft<E, C, B> (fa, f) : map<B, A, C> (fa, g),
}

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"Either"> = {
  _URI: "Either",
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, fromRight (ff)),
}

export const { apply } = applicative

export const monad: Monad2<"Either"> = createMonad2 (functor) ({
  _URI: "Either",
  join: <E, A>(mma: Either<E, Either<E, A>>) =>
    isLeft (mma) ? mma : fromRight (mma),
})

export const {
  Do,
  join,
  bind,
  compose,
  mapTo,
  applyTo,
  applyResultTo,
  apS,
  bindTo,
  tap,
  tapIo,
  returnM,
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
