import * as Option from '../Option'
import * as Result from '../Result'
import * as Sync from '../Sync'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as Monad_ from '../../typeclasses/Monad'
import * as Compactable_ from '../../typeclasses/Compactable'
import * as Extendable_ from '../../typeclasses/Extendable'
import * as Tappable_ from '../../typeclasses/Tappable'
import * as Zippable_ from '../../typeclasses/Zippable'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { FromIdentity } from '../../typeclasses/FromIdentity'
import { FromOption } from '../../typeclasses/FromOption'
import { FromResult } from '../../typeclasses/FromResult'
import { Functor } from '../../typeclasses/Functor'
import { flow, pipe } from '../../utils/flow'
import { identity } from '../Identity'
import { LazyArg } from '../../types/utils'
import { Alt } from '../../typeclasses/Alt'
import { Alternative } from '../../typeclasses/Alternative'

export type OptionT<F extends Hkt, In, Collectable, Fixed> = Kind<
  F,
  Option.Option<In>,
  Collectable,
  Fixed
>

export interface OptionTHkt<F extends Hkt> extends Hkt {
  readonly Type: OptionT<F, this['In'], this['Collectable'], this['Fixed']>
}

export const transform = <F extends Hkt>(M: Monad_.Monad<F>) => {
  type THkt = OptionTHkt<F>

  const some: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow(Option.some, M.of)

  const none: {
    <Collectable, Fixed>(): Kind<THkt, never, Collectable, Fixed>
  } = () => M.of(Option.none())

  const fromKind: {
    <In, Collectable, Fixed>(
      ma: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(Option.some)

  const match: {
    <In, Out1, Collectable, Fixed, Out2 = Out1>(
      matchers: Option.Matchers<In, Out1, Out2>,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out1 | Out2, Collectable, Fixed>
  } = flow(Option.match, M.map)

  const value: {
    <In, Collectable, Fixed>(
      self: Kind<F, Option.Some<In>, Collectable, Fixed>,
    ): Kind<F, In, Collectable, Fixed>
  } = M.map(Option.value)

  const fromNullable: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, NonNullable<In>, Collectable, Fixed>
  } = M.map(Option.fromNullable)

  const fromNull: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, null>, Collectable, Fixed>
  } = M.map(Option.fromNull)

  const toNull: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | null, Collectable, Fixed>
  } = M.map(Option.toNull)

  const fromUndefined: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, undefined>, Collectable, Fixed>
  } = M.map(Option.fromUndefined)

  const toUndefined: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | undefined, Collectable, Fixed>
  } = M.map(Option.toUndefined)

  const fromVoid: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, void>, Collectable, Fixed>
  } = M.map(Option.fromVoid)

  const toVoid: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | void, Collectable, Fixed>
  } = M.map(Option.toVoid)

  const fromKindResult: {
    <In, Collectable, Fixed>(
      ma: Kind<F, Result.Result<In, unknown>, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map(Option.fromResult)

  const toResult: {
    <E>(
      onNone: LazyArg<E>,
    ): <A, Collectable, Fixed>(
      self: Kind<THkt, A, Collectable, Fixed>,
    ) => Kind<F, Result.Result<A, E>, Collectable, Fixed>
  } = onNone => M.map(Option.toResult(onNone))

  const getOrElse: {
    <B>(
      onNone: LazyArg<B>,
    ): <A, Collectable, Fixed>(
      self: Kind<THkt, A, Collectable, Fixed>,
    ) => Kind<F, A | B, Collectable, Fixed>
  } = onNone => M.map(Option.getOrElse(onNone))

  const catchAll: {
    <B, Collectable1, Fixed>(
      that: LazyArg<Kind<THkt, B, Collectable1, Fixed>>,
    ): <A, Collectable2>(
      self: Kind<THkt, A, Collectable2, Fixed>,
    ) => Kind<THkt, A | B, Collectable1 | Collectable2, Fixed>
  } = that =>
    M.flatMap(self =>
      pipe(
        that(),
        M.map(ma => pipe(self, Option.orElse(ma))),
      ),
    )

  const orElse: {
    <B, Collectable1, Fixed>(
      that: Kind<THkt, B, Collectable1, Fixed>,
    ): <A, Collectable2>(
      self: Kind<THkt, A, Collectable2, Fixed>,
    ) => Kind<THkt, A | B, Collectable1 | Collectable2, Fixed>
  } = that =>
    M.flatMap(self =>
      pipe(
        that,
        M.map(ma => Option.orElse(ma)(self)),
      ),
    )

  const FromIdentity: FromIdentity<THkt> = {
    of: some,
  }

  const FromOption: FromOption<THkt> = {
    fromOption: M.of,
  }

  const FromResult: FromResult<THkt> = {
    fromResult: flow(Option.fromResult, M.of),
  }

  const Alt: Alt<THkt> = {
    orElse,
  }

  const Alternative: Alternative<THkt> = {
    ...Alt,
    zero: none,
  }

  const Functor: Functor<THkt> = {
    map: flow(Option.map, M.map),
  }

  const Monad = Monad_.create<THkt>(FromIdentity, Functor, {
    flat: M.flatMap(
      Option.match({
        onNone: () => M.of(Option.none()),
        onSome: identity,
      }),
    ) as Monad_.Monad<THkt>['flat'],
  })

  const Applicative = Applicative_.create<THkt>(Monad)

  const Tappable = Tappable_.create(Monad)

  const tapOption: {
    <In>(
      f: (a: In) => Option.Option<unknown>,
    ): <Collectable, Fixed>(
      self: Kind<F, Option.Option<In>, Collectable, Fixed>,
    ) => Kind<THkt, In, Collectable, Fixed>
  } = f =>
    Monad.flatMap(a =>
      pipe(
        a,
        f,
        FromOption.fromOption,
        Monad.flatMap(() => Monad.of(a)),
      ),
    )

  const tapSyncOption: {
    <In>(
      f: (a: In) => Sync.Sync<Option.Option<unknown>>,
    ): <Collectable, Fixed>(
      self: Kind<F, Option.Option<In>, Collectable, Fixed>,
    ) => Kind<THkt, In, Collectable, Fixed>
  } = f =>
    Monad.flatMap(a =>
      pipe(
        a,
        f,
        Sync.execute,
        FromOption.fromOption,
        Monad.flatMap(() => Monad.of(a)),
      ),
    )

  const tapResult =
    <In>(f: (a: In) => Result.Result<unknown, unknown>) =>
    <Collectable, Fixed>(
      self: Kind<F, Option.Option<In>, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed> =>
      pipe(
        self,
        Monad.flatMap(a =>
          pipe(
            a,
            f,
            FromResult.fromResult<In, Collectable, Fixed>,
            Monad.flatMap(() => Monad.of(a)),
          ),
        ),
      )

  const tapSyncResult =
    <In>(f: (a: In) => Sync.Sync<Result.Result<unknown, unknown>>) =>
    <Collectable, Fixed>(
      self: Kind<F, Option.Option<In>, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed> =>
      pipe(
        self,
        Monad.flatMap(a =>
          pipe(
            a,
            f,
            Sync.execute,
            FromResult.fromResult<In, Collectable, Fixed>,
            Monad.flatMap(() => Monad.of(a)),
          ),
        ),
      )

  const Compactable = Compactable_.create<THkt>(Functor, {
    compact: flow(M.map(Option.flat)),
  })

  const Extendable = Extendable_.create<THkt>(Functor, {
    extend: fab => self => Functor.map(() => fab(self))(self),
  })

  const Zippable = Zippable_.create(Applicative)

  return {
    some,
    none,
    fromKind,
    match,
    value,
    fromNullable,
    fromNull,
    toNull,
    fromUndefined,
    toUndefined,
    fromVoid,
    toVoid,
    fromKindResult,
    toResult,
    getOrElse,
    catchAll,
    FromIdentity,
    ...FromIdentity,
    FromOption,
    ...FromOption,
    FromResult,
    ...FromResult,
    Alt,
    ...Alt,
    Alternative,
    ...Alternative,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
    tapOption,
    tapSyncOption,
    tapResult,
    tapSyncResult,
    Compactable,
    ...Compactable,
    Extendable,
    ...Extendable,
    Zippable,
    ...Zippable,
  }
}
