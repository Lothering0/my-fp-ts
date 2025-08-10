/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from "../Result"
import { identity } from "../Identity"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"

export type ResultT<F extends Hkt, S, E, A> = Kind<
  F,
  any,
  S,
  result.Result<E, A>
>

export interface ResultTHkt<F extends Hkt> extends Hkt {
  readonly type: ResultT<F, this["_S"], this["_E"], this["_A"]>
}

export const transform = <F extends Hkt>(M: Monad<F>) => {
  type THkt = ResultTHkt<F>

  const succeed: {
    <A, S>(a: A): Kind<THkt, S, never, A>
  } = flow (result.succeed, M.of)

  const succeedKind: {
    <A, S>(fe: Kind<F, never, S, A>): Kind<THkt, S, never, A>
  } = M.map (result.succeed)

  const fail: {
    <S, E>(e: E): Kind<THkt, S, E, never>
  } = flow (result.fail, M.of)

  const failKind: {
    <S, E>(fe: Kind<F, never, S, E>): Kind<THkt, S, E, never>
  } = M.map (result.fail)

  const match: {
    <S, R, E, A, B, C = B>(
      onFailure: (e: E) => B,
      onSuccess: (a: A) => C,
    ): (self: Kind<THkt, S, E, A>) => Kind<F, R, S, B | C>
  } = flow (result.match, M.map)

  const swap: {
    <S, E, A>(self: Kind<THkt, S, E, A>): Kind<THkt, S, A, E>
  } = M.map (result.swap)

  const toUnion: {
    <S, R, E, A>(self: Kind<THkt, S, E, A>): Kind<F, R, S, E | A>
  } = M.map (result.toUnion)

  const Functor: Functor<THkt> = {
    map: flow (result.map, M.map),
  }

  const Bifunctor = createBifunctor<THkt> ({
    ...Functor,
    mapLeft: ed => flow (M.map (result.mapLeft (ed))),
  })

  const Applicative = createApplicative<THkt> ({
    ...Functor,
    of: succeed,
    ap:
      <S, E1, A>(fma: Kind<THkt, S, E1, A>) =>
      <E2, B>(self: Kind<THkt, S, E2, (a: A) => B>) =>
        pipe (
          self,
          M.map (mf => (mg: result.Result<E1, A>) => result.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THkt> ({
    ...Applicative,
    flat: <S, E1, E2, A>(
      self: Kind<THkt, S, E1, Kind<THkt, S, E2, A>>,
    ): Kind<THkt, any, E1 | E2, A> =>
      pipe (self, M.flatMap (result.match (flow (result.fail, M.of), identity))),
  })

  return {
    succeed,
    succeedKind,
    fail,
    failKind,
    match,
    swap,
    toUnion,
    Functor,
    ...Functor,
    Bifunctor,
    ...Bifunctor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
  }
}
