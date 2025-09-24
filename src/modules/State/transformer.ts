import * as state from "../State"
import * as applicative from "../../typeclasses/Applicative"
import * as monad from "../../typeclasses/Monad"
import * as tappable from "../../typeclasses/Tappable"
import { Hkt, Kind } from "../../typeclasses/Hkt"
import { Functor } from "../../typeclasses/Functor"
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

export const transform = <F extends Hkt, TFixed>(F: monad.Monad<F>) => {
  type THkt = StateTHkt<F, TFixed>

  const fromState: {
    <In, Collectable, Fixed>(
      self: state.State<TFixed, In>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s => pipe (self, state.run (s), F.of)

  const fromKind: {
    <In, Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s =>
    pipe (
      self,
      F.map (a => [a, s]),
    )

  const gets: {
    <Out, Collectable, Fixed>(
      sa: (s: TFixed) => Out,
    ): Kind<THkt, Out, Collectable, Fixed>
  } = sa => s => pipe (s, state.gets (sa), F.of)

  const get: {
    <Collectable, Fixed>(): Kind<THkt, TFixed, Collectable, Fixed>
  } = () => s => pipe (s, state.get (), F.of)

  const modify: {
    <Collectable, Fixed>(
      ss: (s: TFixed) => TFixed,
    ): Kind<THkt, void, Collectable, Fixed>
  } = ss => s => pipe (s, state.modify (ss), F.of)

  const put: {
    <Collectable, Fixed>(s: TFixed): Kind<THkt, void, Collectable, Fixed>
  } = s1 => s2 => pipe (s2, state.put (s1), F.of)

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

  const Applicative = applicative.create<THkt> (Functor, {
    of: a => s => F.of ([a, s]),
    ap: fa => self => s =>
      pipe (
        self,
        Functor.map (f => Functor.map (f) (fa)),
        run (s),
        F.flatMap (([mb, s]) => run (s) (mb)),
      ),
  })

  const Monad = monad.create<THkt> (Applicative, {
    flat: self => s =>
      pipe (
        self,
        run (s),
        F.flatMap (([mb, s]) => run (s) (mb)),
      ),
  })

  const Tappable = tappable.create (Monad)

  return {
    fromState,
    fromKind,
    gets,
    get,
    modify,
    put,
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
