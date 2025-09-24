import * as option from "../Option"
import * as result from "../Result"
import * as applicative from "../../typeclasses/Applicative"
import * as monad from "../../typeclasses/Monad"
import * as compactable from "../../typeclasses/Compactable"
import * as extendable from "../../typeclasses/Extendable"
import * as tappable from "../../typeclasses/Tappable"
import { Hkt, Kind } from "../../typeclasses/Hkt"
import { Functor } from "../../typeclasses/Functor"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"
import { Alt } from "../../typeclasses/Alt"
import { Alternative } from "../../typeclasses/Alternative"

export type OptionT<F extends Hkt, In, Collectable, Fixed> = Kind<
  F,
  option.Option<In>,
  Collectable,
  Fixed
>

export interface OptionTHkt<F extends Hkt> extends Hkt {
  readonly type: OptionT<F, this["_in"], this["_collectable"], this["_fixed"]>
}

export const transform = <F extends Hkt>(M: monad.Monad<F>) => {
  type THkt = OptionTHkt<F>

  const some: {
    <In, Collectable, Fixed>(a: In): Kind<THkt, In, Collectable, Fixed>
  } = flow (option.some, M.of)

  const zero: {
    <Collectable, Fixed>(): Kind<THkt, never, Collectable, Fixed>
  } = () => M.of (option.none)

  const fromKind: {
    <In, Collectable, Fixed>(
      ma: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map (option.some)

  const match: {
    <In, Out1, Collectable, Fixed, Out2 = Out1>(
      matchers: option.Matchers<In, Out1, Out2>,
    ): (
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Out1 | Out2, Collectable, Fixed>
  } = flow (option.match, M.map)

  const value: {
    <In, Collectable, Fixed>(
      self: Kind<F, option.Some<In>, Collectable, Fixed>,
    ): Kind<F, In, Collectable, Fixed>
  } = M.map (option.value)

  const fromNullable: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, NonNullable<In>, Collectable, Fixed>
  } = M.map (option.fromNullable)

  const fromNull: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, null>, Collectable, Fixed>
  } = M.map (option.fromNull)

  const toNull: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | null, Collectable, Fixed>
  } = M.map (option.toNull)

  const fromUndefined: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, undefined>, Collectable, Fixed>
  } = M.map (option.fromUndefined)

  const toUndefined: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | undefined, Collectable, Fixed>
  } = M.map (option.toUndefined)

  const fromVoid: {
    <In, Collectable, Fixed>(
      a: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, Exclude<In, void>, Collectable, Fixed>
  } = M.map (option.fromVoid)

  const toVoid: {
    <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ): Kind<F, In | void, Collectable, Fixed>
  } = M.map (option.toVoid)

  const fromResult: {
    <In, Collectable, Fixed>(
      ma: Kind<F, result.Result<unknown, In>, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = M.map (option.fromResult)

  const toResult: {
    <E>(
      onNone: LazyArg<E>,
    ): <A, Collectable, Fixed>(
      self: Kind<THkt, A, Collectable, Fixed>,
    ) => Kind<F, result.Result<E, A>, Collectable, Fixed>
  } = onNone => M.map (option.toResult (onNone))

  const getOrElse: {
    <B>(
      onNone: LazyArg<B>,
    ): <A, Collectable, Fixed>(
      self: Kind<THkt, A, Collectable, Fixed>,
    ) => Kind<F, A | B, Collectable, Fixed>
  } = onNone => M.map (option.getOrElse (onNone))

  const catchAll: {
    <B, Collectable1, Fixed>(
      that: LazyArg<Kind<THkt, B, Collectable1, Fixed>>,
    ): <A, Collectable2>(
      self: Kind<THkt, A, Collectable2, Fixed>,
    ) => Kind<THkt, A | B, Collectable1 | Collectable2, Fixed>
  } = that =>
    M.flatMap (self =>
      pipe (
        that (),
        M.map (ma => pipe (self, option.orElse (ma))),
      ),
    )

  const orElse: {
    <B, Collectable1, Fixed>(
      that: Kind<THkt, B, Collectable1, Fixed>,
    ): <A, Collectable2>(
      self: Kind<THkt, A, Collectable2, Fixed>,
    ) => Kind<THkt, A | B, Collectable1 | Collectable2, Fixed>
  } = that =>
    M.flatMap (self =>
      pipe (
        that,
        M.map (ma => option.orElse (ma) (self)),
      ),
    )

  const Alt: Alt<THkt> = {
    orElse,
  }

  const Alternative: Alternative<THkt> = {
    ...Alt,
    zero,
  }

  const Functor: Functor<THkt> = {
    map: flow (option.map, M.map),
  }

  const Applicative = applicative.create<THkt> (Functor, {
    of: some,
    ap:
      <In, Collectable1, Fixed>(fma: Kind<THkt, In, Collectable1, Fixed>) =>
      <Collectable2, Out>(
        self: Kind<THkt, (a: In) => Out, Collectable2, Fixed>,
      ): Kind<THkt, Out, Collectable1 | Collectable2, Fixed> =>
        pipe (
          self,
          M.map (mf => (mg: option.Option<In>) => option.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = monad.create<THkt> (Applicative, {
    flat: M.flatMap (
      option.match ({
        onNone: () => M.of (option.none),
        onSome: identity,
      }),
    ) as monad.Monad<THkt>["flat"],
  })

  const Tappable = tappable.create (Monad)

  const Compactable = compactable.create<THkt> (Functor, {
    compact: flow (M.map (option.flat)),
  })

  const Extendable = extendable.create<THkt> (Functor, {
    extend: fab => self => Functor.map (() => fab (self)) (self),
  })

  return {
    some,
    zero,
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
    fromResult,
    toResult,
    getOrElse,
    catchAll,
    Alt,
    ...Alt,
    Alternative,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
    Compactable,
    ...Compactable,
    Extendable,
    ...Extendable,
  }
}
