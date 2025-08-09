import * as state from "../State"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { pipe } from "../../utils/flow"

export interface StateT<F extends Hkt> extends Hkt {
  readonly type: (
    s: this["_S"],
  ) => Kind<F, this["_S"], this["_E"], readonly [this["_A"], this["_S"]]>
}

export const transform = <F extends Hkt>(F: Monad<F>) => {
  type THkt = StateT<F>

  const fromState: {
    <S, E, A>(self: state.State<S, A>): Kind<THkt, S, E, A>
  } = self => s => F.of (state.run (s) (self))

  const fromF: {
    <S, E, A>(self: Kind<F, S, E, A>): Kind<THkt, S, E, A>
  } = self => s =>
    pipe (
      self,
      F.map (a => [a, s]),
    )

  const run: {
    <S>(s: S): <E, A>(ma: Kind<THkt, S, E, A>) => Kind<F, S, E, readonly [A, S]>
  } = s => ma => ma (s)

  const evaluate: {
    <S>(s: S): <E, A>(ma: Kind<THkt, S, E, A>) => Kind<F, S, E, A>
  } = s => ma => F.map (([a]) => a) (run (s) (ma))

  const execute: {
    <S>(s: S): <E, A>(ma: Kind<THkt, S, E, A>) => Kind<F, S, E, S>
  } = s => ma => F.map (([, s]) => s) (run (s) (ma))

  const Functor: Functor<THkt> = {
    map: f => self => s =>
      pipe (
        self (s),
        F.map (([a, s]) => [f (a), s]),
      ),
  }

  const Applicative = createApplicative<THkt> ({
    ...Functor,
    of: a => s => F.of ([a, s]),
    ap: fa => self => s =>
      pipe (
        self,
        Functor.map (f => Functor.map (f) (fa)),
        run (s),
        F.flatMap (([mb, s]) => run (s) (mb)),
      ),
  })

  const Monad = createMonad<THkt> ({
    ...Applicative,
    flat: self => s =>
      pipe (
        self,
        run (s),
        F.flatMap (([mb, s]) => run (s) (mb)),
      ),
  })

  return {
    fromState,
    fromF,
    run,
    evaluate,
    execute,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
  }
}
