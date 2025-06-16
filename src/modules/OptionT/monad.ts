import * as O from "../Option"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { overload } from "../../utils/overloads"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { pipe } from "../../utils/flow"
import { identity } from "../Identity"

interface Chain2CPointed<URI extends URIS2, E> {
  <A, B>(
    fma: Kind2<URI, E, O.Option<A>>,
    f: (a: A) => Kind2<URI, E, O.Option<B>>,
  ): Kind2<URI, E, O.Option<B>>
}

interface Chain2Pointed<URI extends URIS2> {
  <E, A, B>(
    fma: Kind2<URI, E, O.Option<A>>,
    f: (a: A) => Kind2<URI, E, O.Option<B>>,
  ): Kind2<URI, E, O.Option<B>>
}

interface ChainPointed<URI extends URIS> {
  <A, B>(
    fma: Kind<URI, O.Option<A>>,
    f: (a: A) => Kind<URI, O.Option<B>>,
  ): Kind<URI, O.Option<B>>
}

interface Chain2CPointFree<URI extends URIS2, E> {
  <A, B>(
    f: (a: A) => Kind2<URI, E, O.Option<B>>,
  ): (fma: Kind2<URI, E, O.Option<A>>) => Kind2<URI, E, O.Option<B>>
}

interface Chain2PointFree<URI extends URIS2> {
  <E, A, B>(
    f: (a: A) => Kind2<URI, E, O.Option<B>>,
  ): (fma: Kind2<URI, E, O.Option<A>>) => Kind2<URI, E, O.Option<B>>
}

interface ChainPointFree<URI extends URIS> {
  <A, B>(
    f: (a: A) => Kind<URI, O.Option<B>>,
  ): (fma: Kind<URI, O.Option<A>>) => Kind<URI, O.Option<B>>
}

export interface Chain2C<URI extends URIS2, E>
  extends Chain2CPointed<URI, E>,
    Chain2CPointFree<URI, E> {}

export interface Chain2<URI extends URIS2>
  extends Chain2Pointed<URI>,
    Chain2PointFree<URI> {}

export interface Chain<URI extends URIS>
  extends ChainPointed<URI>,
    ChainPointFree<URI> {}

export function chain<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): Chain2C<URI, E>
export function chain<URI extends URIS2>(monad: Monad2<URI>): Chain2<URI>
export function chain<URI extends URIS>(monad: Monad<URI>): Chain<URI>
export function chain<URI extends URIS>(monad: Monad<URI>): Chain<URI> {
  return overload (
    <A, B>(
      fma: Kind<URI, O.Option<A>>,
      f: (a: A) => Kind<URI, O.Option<B>>,
    ): Kind<URI, O.Option<B>> =>
      pipe (
        monad.Do,
        monad.apS ("ma", fma),
        monad.map (({ ma }) => O.map (ma, f)),
        monad.flatMap (O.match (() => monad.of (O.none), identity)),
      ),
  )
}
