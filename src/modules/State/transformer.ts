import * as State from '../State'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as Monad_ from '../../typeclasses/Monad'
import * as Tappable_ from '../../typeclasses/Tappable'
import * as Zippable_ from '../../typeclasses/Zippable'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { Functor } from '../../typeclasses/Functor'
import { FromIdentity } from '../../typeclasses/FromIdentity'
import { flow, pipe } from '../../utils/flow'

export interface StateT<F extends Hkt, In, Collectable, Fixed, TFixed> {
  (s: TFixed): Kind<F, readonly [In, TFixed], Collectable, Fixed>
}

export interface StateTHkt<F extends Hkt, TFixed> extends Hkt {
  readonly Type: StateT<
    F,
    this['In'],
    this['Collectable'],
    this['Fixed'],
    TFixed
  >
}

export const transform = <F extends Hkt, TFixed>(F: Monad_.Monad<F>) => {
  type THkt = StateTHkt<F, TFixed>

  const fromState: {
    <In, Collectable, Fixed>(
      self: State.State<TFixed, In>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s => pipe(self, State.run(s), F.of)

  const fromKind: {
    <In, Collectable, Fixed>(
      self: Kind<F, In, Collectable, Fixed>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => s =>
    pipe(
      self,
      F.map(a => [a, s]),
    )

  const gets: {
    <Out, Collectable, Fixed>(
      sa: (s: TFixed) => Out,
    ): Kind<THkt, Out, Collectable, Fixed>
  } = sa => s => pipe(s, State.gets(sa), F.of)

  const get: {
    <Collectable, Fixed>(): Kind<THkt, TFixed, Collectable, Fixed>
  } = () => s => pipe(s, State.get(), F.of)

  const modify: {
    <Collectable, Fixed>(
      ss: (s: TFixed) => TFixed,
    ): Kind<THkt, void, Collectable, Fixed>
  } = ss => s => pipe(s, State.modify(ss), F.of)

  const put: {
    <Collectable, Fixed>(s: TFixed): Kind<THkt, void, Collectable, Fixed>
  } = s1 => s2 => pipe(s2, State.put(s1), F.of)

  const run: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, readonly [In, TFixed], Collectable, Fixed>
  } = s => ma => ma(s)

  const evaluate: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, In, Collectable, Fixed>
  } = s => ma => F.map(([a]) => a)(run(s)(ma))

  const execute: {
    (
      s: TFixed,
    ): <In, Collectable, Fixed>(
      ma: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<F, TFixed, Collectable, Fixed>
  } = s => ma => F.map(([, s]) => s)(run(s)(ma))

  const FromIdentity: FromIdentity<THkt> = {
    of: a => s => F.of([a, s]),
  }

  const Functor: Functor<THkt> = {
    map: f => self =>
      flow(
        self,
        F.map(([a, s]) => [f(a), s]),
      ),
  }

  const Monad = Monad_.create<THkt>(FromIdentity, Functor, {
    flat: self => s =>
      pipe(
        self,
        run(s),
        F.flatMap(([mb, s]) => run(s)(mb)),
      ),
  })

  const Applicative = Applicative_.create<THkt>(Monad)

  const Tappable = Tappable_.create(Monad)

  const Zippable = Zippable_.create(Applicative)

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
    FromIdentity,
    ...FromIdentity,
    Functor,
    ...Functor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
    Zippable,
    ...Zippable,
  }
}
