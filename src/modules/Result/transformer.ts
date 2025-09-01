import * as result from "../Result"
import { identity } from "../Identity"
import { Hkt, Kind } from "../../typeclasses/Hkt"
import { Functor } from "../../typeclasses/Functor"
import { createBifunctor } from "../../typeclasses/Bifunctor"
import { createApplicative } from "../../typeclasses/Applicative"
import { createMonad, Monad } from "../../typeclasses/Monad"
import { createTappable } from "../../typeclasses/Tappable"
import { flow, pipe } from "../../utils/flow"

export type ResultT<F extends Hkt, In, Collectable, Fixed, TCollectable> = Kind<
  F,
  result.Result<Collectable, In>,
  TCollectable,
  Fixed
>

export interface ResultTHkt<F extends Hkt, TCollectable> extends Hkt {
  readonly type: ResultT<
    F,
    this["_in"],
    this["_collectable"],
    this["_fixed"],
    TCollectable
  >
}

export const transform = <F extends Hkt, TCollectable>(M: Monad<F>) => {
  type THkt = ResultTHkt<F, TCollectable>

  const succeed: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow (result.succeed, M.of)

  const succeedKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, In, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map (result.succeed)

  const fail: {
    <In, Collectable, Fixed>(e: Collectable): Kind<THkt, In, Collectable, Fixed>
  } = flow (result.fail, M.of)

  const failKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, Collectable, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map (result.fail)

  const match: {
    <In, Out, Collectable, Fixed, CollectableOut>(
      onFailure: (e: Collectable) => CollectableOut,
      onSuccess: (a: In) => Out,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out | CollectableOut, TCollectable, Fixed>
  } = flow (result.match, M.map)

  const swap: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<THkt, Collectable, In, Fixed>
  } = M.map (result.swap)

  const toUnion: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | Collectable, TCollectable, Fixed>
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
    ) =>
      pipe (
        self,
        M.flatMap<
          result.Result<
            Collectable1,
            Kind<F, result.Result<Collectable2, In>, TCollectable, Fixed>
          >,
          result.Result<Collectable1 | Collectable2, In>,
          TCollectable,
          Fixed
        > (result.match (flow (result.fail, M.of), identity)),
      ),
  })

  const Tappable = createTappable (Monad)

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
    Tappable,
    ...Tappable,
  }
}
