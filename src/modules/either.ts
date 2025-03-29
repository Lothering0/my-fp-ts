import { Applicative2, Bifunctor, Functor2, Monad2 } from "../types"

declare module "../types" {
  export interface Kind2<A, B> {
    Either: Either<A, B>
  }
}

export type Either<E, A> = Left<E> | Right<A>

export interface Left<E> {
  _tag: "Left"
  value: E
}

export interface Right<A> {
  _tag: "Right"
  value: A
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

type EitherEliminator = <E, A, B>(
  ma: Either<E, A>,
  f: (e: E) => B,
  g: (a: A) => B,
) => B
export const either: EitherEliminator = (ma, whenLeft, whenRight) =>
  isLeft (ma) ? whenLeft (ma.value) : whenRight (ma.value)

export const functor: Functor2<"Either"> = {
  _URI: "Either",
  pure: right,
  map: (fa, f) => isLeft (fa) ? fa : right (f (fa.value)),
}

export const { pure, map } = functor

export const bifunctor: Bifunctor<"Either"> = {
  _URI: "Either",
  mapLeft: (fa, f) => isRight (fa) ? fa : left (f (fa.value)),
  bimap: <E, A, B = E, C = A>(
    fa: Either<E, A>,
    f: (e: E) => B,
    g: (a: A) => C,
  ) => isLeft (fa) ? mapLeft<E, C, B> (fa, f) : map<B, A, C> (fa, g),
}

export const { mapLeft, bimap } = bifunctor

export const applicative: Applicative2<"Either"> = {
  _URI: "Either",
  apply: (fa, ff) => isLeft (ff) ? ff : map (fa, ff.value),
}

export const { apply } = applicative

export const monad: Monad2<"Either"> = {
  _URI: "Either",
  join: <E, A>(mma: Right<Either<E, A>>) => mma.value,
  bind: (mma, f) => isLeft (mma) ? mma : f (mma.value),
}

export const { join, bind } = monad

export const Do: Either<never, {}> = right ({})
