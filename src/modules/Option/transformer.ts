import * as option from "../Option"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export interface OptionT<F extends Hkt> extends Hkt {
  readonly type: Kind<F, this["_S"], this["_E"], option.Option<this["_A"]>>
}

export const transform = <F extends Hkt>(M: Monad<F>) => {
  type THkt = OptionT<F>

  const some: {
    <S, E, A>(a: A): Kind<THkt, S, E, A>
  } = flow (option.some, M.of)

  const zero: {
    <S, E, A = never>(): Kind<THkt, S, E, A>
  } = () => M.of (option.none)

  const fromF: {
    <S, E, A>(ma: Kind<F, S, E, A>): Kind<THkt, S, E, A>
  } = M.map (option.some)

  const match: {
    <S, E, A, B, C = B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => C,
    ): (self: Kind<THkt, S, E, A>) => Kind<F, S, E, B | C>
  } = flow (option.match, M.map)

  const Functor: Functor<THkt> = {
    map: flow (option.map, M.map),
  }

  const Applicative = createApplicative<THkt> ({
    ...Functor,
    of: some,
    ap:
      <S, E1, A>(fma: Kind<THkt, S, E1, A>) =>
      <E2, B>(
        self: Kind<THkt, S, E2, (a: A) => B>,
      ): Kind<THkt, S, E1 | E2, B> =>
        pipe (
          self,
          M.map (mf => (mg: option.Option<A>) => option.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THkt> ({
    ...Applicative,
    flat: M.flatMap (
      option.match (() => M.of (option.none), identity),
    ) as Monad<THkt>["flat"],
  })

  return {
    some,
    zero,
    fromF,
    match,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
  }
}
