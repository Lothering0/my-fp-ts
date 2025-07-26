/* eslint-disable @typescript-eslint/no-explicit-any */
import * as R from "../Result"
import { identity } from "../Identity"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"

export interface ResultT<F extends HKT> extends HKT {
  readonly type: Kind<F, any, this["_R"], R.Result<this["_E"], this["_A"]>>
}

export const transform = <F extends HKT>(F: Monad<F>) => {
  type THKT = ResultT<F>

  const success: {
    <A, KE, E = never>(a: A): Kind<THKT, KE, E, A>
  } = flow (R.success, F.of) as any

  const successF: {
    <A, KE, E = never>(fe: Kind<F, never, KE, A>): Kind<THKT, KE, E, A>
  } = F.map (R.success)

  const failure: {
    <KE, E, A = never>(e: E): Kind<THKT, KE, E, A>
  } = flow (R.failure, F.of) as any

  const failureF: {
    <KE, E, A = never>(fe: Kind<F, never, KE, E>): Kind<THKT, KE, E, A>
  } = F.map (R.failure)

  const match: {
    <KE, R, E, A, B>(
      onFailure: (e: E) => B,
      onSuccess: (a: A) => B,
    ): (self: Kind<THKT, KE, E, A>) => Kind<F, R, KE, B>
  } = flow (R.match, F.map)

  const swap: {
    <KE, E, A>(self: Kind<THKT, KE, E, A>): Kind<THKT, KE, A, E>
  } = F.map (R.swap)

  const toUnion: {
    <KE, R, E, A>(self: Kind<THKT, KE, E, A>): Kind<F, R, KE, E | A>
  } = F.map (R.toUnion)

  const Functor: Functor<THKT> = {
    map: flow (R.map, F.map),
  }

  const Bifunctor = createBifunctor<THKT> ({
    ...Functor,
    mapLeft: ed => flow (F.map (R.mapLeft (ed))),
  })

  const Applicative = createApplicative<THKT> ({
    ...Functor,
    of: success,
    ap:
      <_, _2, A>(fma: Kind<THKT, _, _2, A>) =>
      <B>(self: Kind<THKT, _, _2, (a: A) => B>) =>
        pipe (
          self,
          F.map (mf => (mg: R.Result<_2, A>) => R.ap (mg) (mf)),
          F.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: flow (F.flatMap (R.match (flow (R.failure, F.of) as any, identity))),
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
