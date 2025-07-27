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
  readonly type: Kind<F, any, this["_R"], result.Result<this["_E"], this["_A"]>>
}

export const transform = <F extends HKT>(M: Monad<F>) => {
  type THKT = ResultT<F>

  const success: {
    <A, KE, E = never>(a: A): Kind<THKT, KE, E, A>
  } = flow (result.success, M.of) as any

  const successF: {
    <A, KE, E = never>(fe: Kind<F, never, KE, A>): Kind<THKT, KE, E, A>
  } = M.map (result.success)

  const failure: {
    <KE, E, A = never>(e: E): Kind<THKT, KE, E, A>
  } = flow (result.failure, M.of) as any

  const failureF: {
    <KE, E, A = never>(fe: Kind<F, never, KE, E>): Kind<THKT, KE, E, A>
  } = M.map (result.failure)

  const match: {
    <KE, R, E, A, B>(
      onFailure: (e: E) => B,
      onSuccess: (a: A) => B,
    ): (self: Kind<THKT, KE, E, A>) => Kind<F, R, KE, B>
  } = flow (result.match, M.map)

  const swap: {
    <KE, E, A>(self: Kind<THKT, KE, E, A>): Kind<THKT, KE, A, E>
  } = M.map (result.swap)

  const toUnion: {
    <KE, R, E, A>(self: Kind<THKT, KE, E, A>): Kind<F, R, KE, E | A>
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
    of: success,
    ap:
      <_, _2, A>(fma: Kind<THKT, _, _2, A>) =>
      <B>(self: Kind<THKT, _, _2, (a: A) => B>) =>
        pipe (
          self,
          M.map (mf => (mg: result.Result<_2, A>) => result.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: flow (
      M.flatMap (result.match (flow (result.failure, M.of) as any, identity)),
    ),
  })

  return {
    success,
    successF,
    failure,
    failureF,
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
