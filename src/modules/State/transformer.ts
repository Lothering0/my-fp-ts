import * as state from "../State"
import { Hkt, Kind } from "../../typeclasses/Hkt"
import { Functor } from "../../typeclasses/Functor"
import { createApplicative } from "../../typeclasses/Applicative"
import { createMonad, Monad } from "../../typeclasses/Monad"
import { createTappable } from "../../typeclasses/Tappable"
import { flow, pipe } from "../../utils/flow"

export interface StateT<F extends Hkt, In, Collectable, Fixed, TFixed> {
  (s: TFixed): Kind<F, readonly [In, TFixed], Collectable, Fixed>
}

export interface StateTHkt<F extends Hkt, TFixed> extends Hkt {
  readonly type: StateT<
    F,
    this["_in"],
    this["_collectable"],
    this["_fixed"],
    TFixed
  >
}

export const transform = <F extends Hkt, TFixed>(F: Monad<F>) => {
  type THkt = StateTHkt<F, TFixed>

  const fromState: {
    <In, Collectable, Fixed>(
      self: state.State<TFixed, In>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s => F.of (state.run (s) (self))

  const fromKind: {
    <In, Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s =>
    pipe (
      self,
      F.map (a => [a, s]),
    )

  const run: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, readonly [In, TFixed], Collectable, Fixed>
  } = s => ma => ma (s)

  const evaluate: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, In, Collectable, Fixed>
  } = s => ma => F.map (([a]) => a) (run (s) (ma))

  const execute: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, TFixed, Collectable, Fixed>
  } = s => ma => F.map (([, s]) => s) (run (s) (ma))

  const Functor: Functor<THkt> = {
    map: f => self =>
      flow (
        self,
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

  const Tappable = createTappable (Monad)

  return {
    fromState,
    fromKind,
    run,
    evaluate,
    execute,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
  }
}
