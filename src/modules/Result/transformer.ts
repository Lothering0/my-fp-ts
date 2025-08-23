/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result from "../Result"
import { identity } from "../Identity"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createBifunctor } from "../../types/Bifunctor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"

export type ResultT<F extends Hkt, In, Collectable, Fixed> = Kind<
  F,
  result.Result<Collectable, In>,
  Fixed,
  any
>

export interface ResultTHkt<F extends Hkt> extends Hkt {
  readonly type: ResultT<F, this["_in"], this["_collectable"], this["_fixed"]>
}

export const transform = <F extends Hkt>(M: Monad<F>) => {
  type THkt = ResultTHkt<F>

  const succeed: {
    <In, Fixed>(a: In): Kind<THkt, In, never, Fixed>
  } = flow (result.succeed, M.of)

  const succeedKind: {
    <In, Fixed>(fe: Kind<F, In, Fixed, never>): Kind<THkt, In, never, Fixed>
  } = M.map (result.succeed)

  const fail: {
    <Collectable, Fixed>(e: Collectable): Kind<THkt, never, Collectable, Fixed>
  } = flow (result.fail, M.of)

  const failKind: {
    <Collectable, Fixed>(
      fe: Kind<F, Collectable, Fixed, never>,
    ): Kind<THkt, never, Collectable, Fixed>
  } = M.map (result.fail)

  const match: {
    <In, Collectable, CollectableOut, Fixed1, Fixed2, Out = CollectableOut>(
      onFailure: (e: Collectable) => CollectableOut,
      onSuccess: (a: In) => Out,
    ): (
      self: Kind<THkt, In, Collectable, Fixed1>,
    ) => Kind<F, Out | CollectableOut, Fixed1, Fixed2>
  } = flow (result.match, M.map)

  const swap: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<THkt, Collectable, In, Fixed>
  } = M.map (result.swap)

  const toUnion: {
    <Fixed1, Fixed2, Collectable, In>(
      self: Kind<THkt, In, Collectable, Fixed1>,
    ): Kind<F, Collectable | In, Fixed1, Fixed2>
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
      <In, Collectable1, Fixed>(fma: Kind<THkt, In, Collectable1, Fixed>) =>
      <Out, Collectable2>(
        self: Kind<THkt, (a: In) => Out, Collectable2, Fixed>,
      ) =>
        pipe (
          self,
          M.map (
            mf => (mg: result.Result<Collectable1, In>) => result.ap (mg) (mf),
          ),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THkt> ({
    ...Applicative,
    flat: <In, Collectable1, Collectable2, Fixed>(
      self: Kind<
        THkt,
        Kind<THkt, In, Collectable2, Fixed>,
        Collectable1,
        Fixed
      >,
    ): Kind<THkt, In, Collectable1 | Collectable2, any> =>
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
