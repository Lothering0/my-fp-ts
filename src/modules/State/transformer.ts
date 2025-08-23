import * as state from "../State"
import { Hkt, Kind } from "../../types/Hkt"
import { Functor } from "../../types/Functor"
import { createApplicative } from "../../types/Applicative"
import { createMonad, Monad } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"

export interface StateT<F extends Hkt, In, Collectable, Fixed> {
  (s: Fixed): Kind<F, readonly [In, Fixed], Collectable, Fixed>
}

export interface StateTHkt<F extends Hkt> extends Hkt {
  readonly type: StateT<F, this["_in"], this["_collectable"], this["_fixed"]>
}

export const transform = <F extends Hkt>(F: Monad<F>) => {
  type THkt = StateTHkt<F>

  const fromState: {
    <In, Collectable, Fixed>(
      self: state.State<Fixed, In>,
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
    <Fixed>(
      s: Fixed,
    ): <In, Collectable>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, readonly [In, Fixed], Collectable, Fixed>
  } = s => ma => ma (s)

  const evaluate: {
    <Fixed>(
      s: Fixed,
    ): <In, Collectable>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, In, Collectable, Fixed>
  } = s => ma => F.map (([a]) => a) (run (s) (ma))

  const execute: {
    <Fixed>(
      s: Fixed,
    ): <In, Collectable>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, Fixed, Collectable, Fixed>
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
  }
}
