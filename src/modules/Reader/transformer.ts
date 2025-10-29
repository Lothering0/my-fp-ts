import * as Reader from '../Reader'
import * as Functor_ from '../../typeclasses/Functor'
import * as Contravariant_ from '../../typeclasses/Contravariant'
import * as Profunctor_ from '../../typeclasses/Profunctor'
import * as Applicative_ from '../../typeclasses/Applicative'
import * as Monad_ from '../../typeclasses/Monad'
import * as Tappable_ from '../../typeclasses/Tappable'
import { Hkt, Kind } from '../../typeclasses/Hkt'
import { FromIdentity } from '../../typeclasses/FromIdentity'
import { flow, pipe } from '../../utils/flow'

export interface ReaderT<F extends Hkt, In, Collectable, Fixed, TFixed> {
  (r: Fixed): Kind<F, In, Collectable, TFixed>
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

export const transform = <F extends Hkt, Fixed1>(F: Monad_.Monad<F>) => {
  type THkt = ReaderTHkt<F, Fixed1>

  const fromReader: {
    <In, Collectable, Fixed>(
      self: Reader.Reader<Fixed, In>,
    ): Kind<THkt, In, Collectable, Fixed>
  } = self => flow(self, F.of)

  const ask: {
    <Collectable, Fixed>(): Kind<THkt, Fixed, Collectable, Fixed>
  } = () => F.of

  const asks: {
    <Out, Collectable, Fixed>(
      f: (r: Fixed) => Out,
    ): Kind<THkt, Out, Collectable, Fixed>
  } = f => flow(f, F.of)

  const asksReader: {
    <Fixed1, Fixed2, Out, Collectable>(
      f: (r: Fixed1) => Reader.Reader<Fixed2, Out>,
    ): Kind<THkt, Out, Collectable, Fixed1 & Fixed2>
  } = f => r => pipe(r, f(r), F.of)

  const local: {
    <Fixed2>(
      f: (r2: Fixed2) => Fixed1,
    ): <In, Collectable>(
      self: Kind<THkt, In, Collectable, Fixed1>,
    ) => Kind<THkt, In, Collectable, Fixed2>
  } = f => self => flow(f, self)

  const Functor = Functor_.create<THkt>({
    map: f => self => flow(self, F.map(f)),
  })

  const Contravariant: Contravariant_.Contravariant<THkt> = {
    contramap: f => self => flow(f, self),
  }

  const Profunctor = Profunctor_.create<THkt>(Functor, Contravariant)

  const FromIdentity: FromIdentity<THkt> = {
    of: a => () => F.of(a),
  }

  const Monad = Monad_.create<THkt>(FromIdentity, Functor, {
    flat: self => r =>
      pipe(
        r,
        self,
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
    Contravariant,
    ...Contravariant,
    Profunctor,
    ...Profunctor,
    Applicative,
    ...Applicative,
    Monad,
    ...Monad,
    Tappable,
    ...Tappable,
  }
}
