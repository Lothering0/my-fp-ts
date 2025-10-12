import * as Result from '../Result'
import * as Bifunctor_ from '../../typeclasses/Bifunctor'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as Monad_ from '../../typeclasses/Monad'
import * as Extendable_ from '../../typeclasses/Extendable'
import * as Tappable_ from '../../typeclasses/Tappable'
import * as Zippable_ from '../../typeclasses/Zippable'
import { identity } from '../Identity'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { FromIdentity } from '../../typeclasses/FromIdentity'
import { FromResult } from '../../typeclasses/FromResult'
import { Functor } from '../../typeclasses/Functor'
import { flow, pipe } from '../../utils/flow'
import { Alt } from '../../typeclasses/Alt'

export type ResultT<F extends Hkt, In, Collectable, Fixed, TCollectable> = Kind<
  F,
  Result.Result<In, Collectable>,
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

export const transform = <F extends Hkt, TCollectable>(M: Monad_.Monad<F>) => {
  type THkt = ResultTHkt<F, TCollectable>

  const succeed: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow(Result.succeed, M.of)

  const succeedKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, In, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(Result.succeed)

  const fail: {
    <In, Collectable, Fixed>(e: Collectable): Kind<THkt, In, Collectable, Fixed>
  } = flow(Result.fail, M.of)

  const failKind: {
    <In, Collectable, Fixed>(
      fe: Kind<F, Collectable, TCollectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(Result.fail)

  const match: {
    <In, Out, Collectable, Fixed, CollectableOut>(
      matchers: Result.Matchers<In, Out, Collectable, CollectableOut>,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out | CollectableOut, TCollectable, Fixed>
  } = flow(Result.match, M.map)

  const swap: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<THkt, Collectable, In, Fixed>
  } = M.map(Result.swap)

  const toUnion: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | Collectable, TCollectable, Fixed>
  } = M.map(Result.toUnion)

  const failureOf: {
    <Collectable, Fixed>(
      self: Kind<F, Result.Failure<TCollectable>, Collectable, Fixed>,
    ): Kind<F, TCollectable, Collectable, Fixed>
  } = M.map(Result.failureOf)

  const successOf: {
    <In, Collectable, Fixed>(
      self: Kind<F, Result.Success<In>, Collectable, Fixed>,
    ): Kind<F, In, Collectable, Fixed>
  } = M.map(Result.successOf)

  const getOrElse: {
    <Out, Collectable>(
      onFailure: (e: Collectable) => Out,
    ): <In, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, In | Out, TCollectable, Fixed>
  } = onFailure => M.map(Result.getOrElse(onFailure))

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
        M.map(ma => pipe(self, Result.orElse(ma))),
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
          Result.Result<In, Collectable1>,
          Result.Result<In | Out, Collectable1 | Collectable2>,
          TCollectable,
          Fixed
        >(
          Result.match({
            onSuccess: succeed<In, Collectable1, Fixed>,
            onFailure,
          }),
        ),
      )

  const FromIdentity: FromIdentity<THkt> = {
    of: succeed,
  }

  const FromResult: FromResult<THkt> = {
    fromResult: M.of,
  }

  const Alt: Alt<THkt> = {
    orElse,
  }

  const Functor: Functor<THkt> = {
    map: flow(Result.map, M.map),
  }

  const Bifunctor = Bifunctor_.create<THkt>(Functor, {
    mapLeft: ed => flow(M.map(Result.mapLeft(ed))),
  })

  const Monad = Monad_.create<THkt>(FromIdentity, Functor, {
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
          Result.Result<
            Kind<F, Result.Result<In, Collectable2>, TCollectable, Fixed>,
            Collectable1
          >,
          Result.Result<In, Collectable1 | Collectable2>,
          TCollectable,
          Fixed
        >(
          Result.match({
            onFailure: flow(Result.fail, M.of),
            onSuccess: identity,
          }),
        ),
      ),
  })

  const Applicative = Applicative_.create<THkt>(Monad)

  const Tappable = Tappable_.create(Monad)

  const Extendable = Extendable_.create<THkt>(Functor, {
    extend: fab => self =>
      pipe(
        self,
        Functor.map(() => fab(self)),
      ),
  })

  const Zippable = Zippable_.create(Applicative)

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
    FromIdentity,
    ...FromIdentity,
    FromResult,
    ...FromResult,
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
    Zippable,
    ...Zippable,
  }
}
