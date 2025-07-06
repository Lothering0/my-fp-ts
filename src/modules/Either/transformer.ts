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

export const transform = <F extends HKT>(F: Monad<F>) => {
  type THKT = EitherT<F>

  const right: {
    <A, KE, E = never>(a: A): Kind<THKT, KE, E, A>
  } = flow (E.right, F.of) as any

  const rightF: {
    <A, KE, E = never>(fe: Kind<F, never, KE, A>): Kind<THKT, KE, E, A>
  } = F.map (E.right)

  const left: {
    <KE, E, A = never>(e: E): Kind<THKT, KE, E, A>
  } = flow (E.left, F.of) as any

  const leftF: {
    <KE, E, A = never>(fe: Kind<F, never, KE, E>): Kind<THKT, KE, E, A>
  } = F.map (E.left)

  const match: {
    <KE, R, E, A, B>(
      onLeft: (e: E) => B,
      onRight: (a: A) => B,
    ): (self: Kind<THKT, KE, E, A>) => Kind<F, R, KE, B>
    <KE, R, E, A, B>(
      self: Kind<THKT, KE, E, A>,
      onLeft: (e: E) => B,
      onRight: (a: A) => B,
    ): Kind<F, R, KE, B>
  } = overload (2, (self, onLeft, onRight) =>
    F.map (self, E.match (onLeft, onRight)),
  )

  const swap: {
    <KE, E, A>(self: Kind<THKT, KE, E, A>): Kind<THKT, KE, A, E>
  } = F.map (E.swap)

  const toUnion: {
    <KE, R, E, A>(ma: Kind<THKT, KE, E, A>): Kind<F, R, KE, E | A>
  } = F.map (E.toUnion)

  const functor: Functor<THKT> = {
    map: overload (1, (self, f) => F.map (self, E.map (f))),
  }

  const bifunctor = createBifunctor<THKT> ({
    ...functor,
    mapLeft: overload (1, (self, f) => F.map (self, E.mapLeft (f))),
  })

  const applicative = createApplicative<THKT> ({
    ...functor,
    of: right,
    ap: overload (
      1,
      <_, _2, A, B>(
        self: Kind<THKT, _, _2, (a: A) => B>,
        fma: Kind<THKT, _, _2, A>,
      ): Kind<THKT, _, _2, B> =>
        pipe (
          self,
          F.map (mf => (mg: E.Either<_2, A>) => E.ap (mf, mg)),
          F.ap (fma),
        ),
    ),
  })

  const monad = createMonad<THKT> ({
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
