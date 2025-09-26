import * as result from '../Result'
import * as bifunctor from '../../typeclasses/Bifunctor'
import * as applicative from '../../typeclasses/Applicative'
import * as monad from '../../typeclasses/Monad'
import * as extendable from '../../typeclasses/Extendable'
import * as tappable from '../../typeclasses/Tappable'
import { identity } from '../Identity'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { Functor } from '../../typeclasses/Functor'
import { flow, pipe } from '../../utils/flow'
import { Alt } from '../../typeclasses/Alt'

export type ResultT<F extends Hkt, In, Collectable, Fixed, TCollectable> = Kind<
  F,
  result.Result<Collectable, In>,
  TCollectable,
  Fixed
>

export interface ResultTHkt<F extends Hkt, TCollectable> extends Hkt {
  readonly Type: ResultT<
    F,
    this['In'],
    this['Collectable'],
    this['Fixed'],
    TCollectable
  >
}

export const transform = <F extends Hkt, TCollectable>(M: monad.Monad<F>) => {
  type THkt = ResultTHkt<F, TCollectable>

  const succeed: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow(result.succeed, M.of)

  const succeedKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, In, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(result.succeed)

  const fail: {
    <In, Collectable, Fixed>(e: Collectable): Kind<THkt, In, Collectable, Fixed>
  } = flow(result.fail, M.of)

  const failKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, Collectable, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(result.fail)

  const match: {
    <In, Out, Collectable, Fixed, CollectableOut>(
      matchers: result.Matchers<Collectable, In, Out, CollectableOut>,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out | CollectableOut, TCollectable, Fixed>
  } = flow(result.match, M.map)

  const swap: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<THkt, Collectable, In, Fixed>
  } = M.map(result.swap)

  const toUnion: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | Collectable, TCollectable, Fixed>
  } = M.map(result.toUnion)

  const failureOf: {
    <Collectable, Fixed>(
      self: Kind<F, result.Failure<TCollectable>, Collectable, Fixed>,
    ): Kind<F, TCollectable, Collectable, Fixed>
  } = M.map(result.failureOf)

  const successOf: {
    <In, Collectable, Fixed>(
      self: Kind<F, result.Success<In>, Collectable, Fixed>,
    ): Kind<F, In, Collectable, Fixed>
  } = M.map(result.successOf)

  const getOrElse: {
    <Out, Collectable>(
      onFailure: (e: Collectable) => Out,
    ): <In, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, In | Out, TCollectable, Fixed>
  } = onFailure => M.map(result.getOrElse(onFailure))

  const orElse: {
    <In, Collectable1, Fixed>(
      onFailure: Kind<THkt, In, Collectable1, Fixed>,
    ): <Out, Collectable2>(
      self: Kind<THkt, Out, Collectable2, Fixed>,
    ) => Kind<THkt, In | Out, Collectable1 | Collectable2, Fixed>
  } = onFailure =>
    M.flatMap(self =>
      pipe(
        onFailure,
        M.map(ma => pipe(self, result.orElse(ma))),
      ),
    )

  const catchAll =
    <Out, Collectable1, Collectable2, Fixed>(
      onFailure: (e: Collectable1) => Kind<THkt, Out, Collectable2, Fixed>,
    ) =>
    <In>(
      self: Kind<THkt, In, Collectable1, Fixed>,
    ): Kind<THkt, In | Out, Collectable1 | Collectable2, Fixed> =>
      pipe(
        self,
        M.flatMap<
          result.Result<Collectable1, In>,
          result.Result<Collectable1 | Collectable2, In | Out>,
          TCollectable,
          Fixed
        >(
          result.match({
            onSuccess: succeed<In, Collectable1, Fixed>,
            onFailure,
          }),
        ),
      )

  const Alt: Alt<THkt> = {
    orElse,
  }

  const Functor: Functor<THkt> = {
    map: flow(result.map, M.map),
  }

  const Bifunctor = bifunctor.create<THkt>(Functor, {
    mapLeft: ed => flow(M.map(result.mapLeft(ed))),
  })

  const Applicative = applicative.create<THkt>(Functor, {
    of: succeed,
    ap:
      <In, Collectable1, Fixed>(fma: Kind<THkt, In, Collectable1, Fixed>) =>
      <Out, Collectable2>(
        self: Kind<THkt, (a: In) => Out, Collectable2, Fixed>,
      ) =>
        pipe(
          self,
          M.map(
            mf => (mg: result.Result<Collectable1, In>) => result.ap(mg)(mf),
          ),
          M.ap(fma),
        ),
  })

  const Monad = monad.create<THkt>(Applicative, {
    flat: <In, Collectable1, Collectable2, Fixed>(
      self: Kind<
        THkt,
        Kind<THkt, In, Collectable2, Fixed>,
        Collectable1,
        Fixed
      >,
    ) =>
      pipe(
        self,
        M.flatMap<
          result.Result<
            Collectable1,
            Kind<F, result.Result<Collectable2, In>, TCollectable, Fixed>
          >,
          result.Result<Collectable1 | Collectable2, In>,
          TCollectable,
          Fixed
        >(
          result.match({
            onFailure: flow(result.fail, M.of),
            onSuccess: identity,
          }),
        ),
      ),
  })

  const Tappable = tappable.create(Monad)

  const Extendable = extendable.create<THkt>(Functor, {
    extend: fab => self =>
      pipe(
        self,
        Functor.map(() => fab(self)),
      ),
  })

  return {
    succeed,
    succeedKind,
    fail,
    failKind,
    match,
    swap,
    toUnion,
    failureOf,
    successOf,
    getOrElse,
    catchAll,
    Alt,
    ...Alt,
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
    Extendable,
    ...Extendable,
  }
}
