/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from "../Result"
import { identity } from "../Identity"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"

export interface ResultT<F extends HKT> extends HKT {
  readonly type: Kind<F, any, this["_S"], result.Result<this["_E"], this["_A"]>>
}

export const transform = <F extends HKT>(M: Monad<F>) => {
  type THKT = ResultT<F>

  const succeed: {
    <A, S, E = never>(a: A): Kind<THKT, S, E, A>
  } = flow (result.succeed, M.of)

  const succeedF: {
    <A, S, E = never>(fe: Kind<F, never, S, A>): Kind<THKT, S, E, A>
  } = M.map (result.succeed)

  const fail: {
    <S, E, A = never>(e: E): Kind<THKT, S, E, A>
  } = flow (result.fail, M.of)

  const failF: {
    <S, E, A = never>(fe: Kind<F, never, S, E>): Kind<THKT, S, E, A>
  } = M.map (result.fail)

  const match: {
    <S, R, E, A, B, C = B>(
      onFailure: (e: E) => B,
      onSuccess: (a: A) => C,
    ): (self: Kind<THKT, S, E, A>) => Kind<F, R, S, B | C>
  } = flow (result.match, M.map)

  const swap: {
    <S, E, A>(self: Kind<THKT, S, E, A>): Kind<THKT, S, A, E>
  } = M.map (result.swap)

  const toUnion: {
    <S, R, E, A>(self: Kind<THKT, S, E, A>): Kind<F, R, S, E | A>
  } = M.map (result.toUnion)

  const Functor: Functor<THKT> = {
    map: flow (result.map, M.map),
  }

  const Bifunctor = createBifunctor<THKT> ({
    ...Functor,
    mapLeft: ed => flow (M.map (result.mapLeft (ed))),
  })

  const Applicative = createApplicative<THKT> ({
    ...Functor,
    of: succeed,
    ap:
      <S, E1, A>(fma: Kind<THKT, S, E1, A>) =>
      <E2, B>(self: Kind<THKT, S, E2, (a: A) => B>) =>
        pipe (
          self,
          M.map (mf => (mg: result.Result<E1, A>) => result.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: <S, E1, E2, A>(
      self: Kind<THKT, S, E1, Kind<THKT, S, E2, A>>,
    ): Kind<THKT, any, E1 | E2, A> =>
      pipe (self, M.flatMap (result.match (flow (result.fail, M.of), identity))),
  })

  return {
    succeed,
    succeedF,
    fail,
    failF,
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
