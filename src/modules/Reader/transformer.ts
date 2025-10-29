import * as Reader from '../Reader'
import * as Functor_ from '../../typeclasses/Functor'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as Monad_ from '../../typeclasses/Monad'
import * as Tappable_ from '../../typeclasses/Tappable'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { FromIdentity } from '../../typeclasses/FromIdentity'
import { Profunctor } from '../../typeclasses/Profunctor'
import { flow, pipe } from '../../utils/flow'

export interface ReaderT<F extends Hkt, In, Collectable, Fixed, TFixed> {
  (r: TFixed): Kind<F, In, Collectable, Fixed>
}

export interface ReaderTHkt<F extends Hkt, TFixed> extends Hkt {
  readonly Type: ReaderT<
    F,
    this['In'],
    this['Collectable'],
    this['Fixed'],
    TFixed
  >
}

export interface ReaderCollectableT<
  F extends Hkt,
  In,
  Collectable,
  Fixed,
  TCollectable,
> {
  (r: Collectable): Kind<F, In, TCollectable, Fixed>
}

export interface ReaderCollectableTHkt<F extends Hkt, TCollectable>
  extends Hkt {
  readonly Type: ReaderCollectableT<
    F,
    this['In'],
    this['Collectable'],
    this['Fixed'],
    TCollectable
  >
}

export const transform = <F extends Hkt, TFixed>(F: Monad_.Monad<F>) => {
  type THkt = ReaderTHkt<F, TFixed>

  const fromReader: {
    <In, Collectable, Fixed>(
      self: Reader.Reader<TFixed, In>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => flow(self, F.of)

  const ask: {
    <Collectable, Fixed>(): Kind<THkt, TFixed, Collectable, Fixed>
  } = () => F.of

  const asks: {
    <Out, Collectable, Fixed>(
      f: (r: TFixed) => Out,
    ): Kind<THkt, Out, Collectable, Fixed>
  } = f => flow(f, F.of)

  const asksReader: {
    <TFixed2, Out, Collectable, Fixed>(
      f: (r: TFixed) => Reader.Reader<TFixed2, Out>,
    ): Kind<ReaderTHkt<F, TFixed & TFixed2>, Out, Collectable, Fixed>
  } = f => r => pipe(r, f(r), F.of)

  const local: {
    <TFixed2>(
      f: (r2: TFixed2) => TFixed,
    ): <In, Collectable, Fixed>(
      self: Kind<THkt, In, Collectable, Fixed>,
    ) => Kind<ReaderTHkt<F, TFixed2>, In, Collectable, Fixed>
  } = f => self => flow(f, self)

  const Functor = Functor_.create<THkt>({
    map: f => self => flow(self, F.map(f)),
  })

  const getProfunctor = <TCollectable>(): Profunctor<
    ReaderCollectableTHkt<F, TCollectable>
  > => ({
    ...(Functor as Functor_.Functor<ReaderCollectableTHkt<F, TCollectable>>),
    promap: (de, ab) => self => flow(de, self, F.map(ab)),
  })

  const FromIdentity: FromIdentity<THkt> = {
    of: a => () => F.of(a),
  }

  const Monad = Monad_.create<THkt>(FromIdentity, Functor, {
    flat: self => r =>
      pipe(
        self(r),
        F.flatMap(f => f(r)),
      ),
  })

  const Applicative = Applicative_.create<THkt>(Monad)

  const Tappable = Tappable_.create(Monad)

  return {
    fromReader,
    ask,
    asks,
    asksReader,
    local,
    FromIdentity,
    ...FromIdentity,
    Functor,
    ...Functor,
    getProfunctor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
  }
}
