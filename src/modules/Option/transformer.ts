import * as option from "../Option"
import { HKT, Kind } from "../../types/HKT"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"
import { LazyArg } from "../../types/utils"

export interface OptionT<F extends HKT> extends HKT {
  readonly type: Kind<F, this["_S"], this["_E"], option.Option<this["_A"]>>
}

export const transform = <F extends HKT>(M: Monad<F>) => {
  type THKT = OptionT<F>

  const some: {
    <S, E, A>(a: A): Kind<THKT, S, E, A>
  } = flow (option.some, M.of)

  const zero: {
    <S, E, A = never>(): Kind<THKT, S, E, A>
  } = () => M.of (option.none)

  const fromF: {
    <S, E, A>(ma: Kind<F, S, E, A>): Kind<THKT, S, E, A>
  } = M.map (option.some)

  const match: {
    <S, E, A, B, C = B>(
      onNone: LazyArg<B>,
      onSome: (a: A) => C,
    ): (self: Kind<THKT, S, E, A>) => Kind<F, S, E, B | C>
  } = flow (option.match, M.map)

  const Functor: Functor<THKT> = {
    map: flow (option.map, M.map),
  }

  const Applicative = createApplicative<THKT> ({
    ...Functor,
    of: some,
    ap:
      <S, E1, A>(fma: Kind<THKT, S, E1, A>) =>
      <E2, B>(
        self: Kind<THKT, S, E2, (a: A) => B>,
      ): Kind<THKT, S, E1 | E2, B> =>
        pipe (
          self,
          M.map (mf => (mg: option.Option<A>) => option.ap (mg) (mf)),
          M.ap (fma),
        ),
  })

  const Monad = createMonad<THKT> ({
    ...Applicative,
    flat: M.flatMap (
      option.match (() => M.of (option.none), identity),
    ) as Monad<THKT>["flat"],
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
