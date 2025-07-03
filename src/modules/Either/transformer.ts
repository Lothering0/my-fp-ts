/* eslint-disable @typescript-eslint/no-explicit-any */
import * as E from "../Either"
import { identity } from "../Identity"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { overload } from "../../utils/overloads"

export interface EitherT<F extends HKT> extends HKT {
  readonly type: Kind<F, any, this["_R"], E.Either<this["_E"], this["_A"]>>
}

export const getEitherT = <F extends HKT>(F: Monad<F>) => {
  type TransformedHKT = EitherT<F>

  const right: {
    <A, KE, E = never>(a: A): Kind<TransformedHKT, KE, E, A>
  } = flow (E.right, F.of) as any

  const rightF: {
    <A, KE, E = never>(
      fe: Kind<F, never, KE, A>,
    ): Kind<TransformedHKT, KE, E, A>
  } = F.map (E.right)

  const left: {
    <KE, E, A = never>(e: E): Kind<TransformedHKT, KE, E, A>
  } = flow (E.left, F.of) as any

  const leftF: {
    <KE, E, A = never>(
      fe: Kind<F, never, KE, E>,
    ): Kind<TransformedHKT, KE, E, A>
  } = F.map (E.left)

  const match: {
    <KE, R, E, A, B>(
      onLeft: (e: E) => B,
      onRight: (a: A) => B,
    ): (self: Kind<TransformedHKT, KE, E, A>) => Kind<F, R, KE, B>
    <KE, R, E, A, B>(
      self: Kind<TransformedHKT, KE, E, A>,
      onLeft: (e: E) => B,
      onRight: (a: A) => B,
    ): Kind<F, R, KE, B>
  } = overload (2, (mm, onLeft, onRight) => F.map (mm, E.match (onLeft, onRight)))

  const swap: {
    <KE, E, A>(
      self: Kind<TransformedHKT, KE, E, A>,
    ): Kind<TransformedHKT, KE, A, E>
  } = F.map (E.swap)

  const toUnion: {
    <KE, R, E, A>(ma: Kind<TransformedHKT, KE, E, A>): Kind<F, R, KE, E | A>
  } = F.map (E.toUnion)

  const functor: Functor<TransformedHKT> = {
    map: overload (1, (fma, f) => F.map (fma, E.map (f))),
  }

  const bifunctor = createBifunctor<TransformedHKT> ({
    ...functor,
    mapLeft: overload (1, (fma, f) => F.map (fma, E.mapLeft (f))),
  })

  const applicative = createApplicative<TransformedHKT> ({
    ...functor,
    of: right,
    ap: overload (
      1,
      <_, _2, A, B>(
        fmf: Kind<TransformedHKT, _, _2, (a: A) => B>,
        fma: Kind<TransformedHKT, _, _2, A>,
      ): Kind<TransformedHKT, _, _2, B> =>
        pipe (
          fmf,
          F.map (mf => (mg: E.Either<_2, A>) => E.ap (mf, mg)),
          F.ap (fma),
        ),
    ),
  })

  const monad = createMonad<TransformedHKT> ({
    ...applicative,
    flat: flow (F.flatMap (E.match (flow (E.left, F.of) as any, identity))),
  })

  return {
    right,
    rightF,
    left,
    leftF,
    match,
    swap,
    toUnion,
    functor,
    ...functor,
    bifunctor,
    ...bifunctor,
    applicative,
    ...applicative,
    monad,
    ...monad,
  }
}
