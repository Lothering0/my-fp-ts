import * as E from "../../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../../types/Functor"
import { overload } from "../../../utils/overloads"

interface Bimap2CPointed<URI extends URIS2, KE> {
  <E, A, D, B>(
    fa: Kind2<URI, KE, E.Either<E, A>>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): Kind2<URI, KE, E.Either<D, B>>
}

interface Bimap2Pointed<URI extends URIS2> {
  <KE, E, A, D, B>(
    fa: Kind2<URI, KE, E.Either<E, A>>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): Kind2<URI, KE, E.Either<D, B>>
}

interface BimapPointed<URI extends URIS> {
  <E, A, D, B>(
    fa: Kind<URI, E.Either<E, A>>,
    f: (e: E) => D,
    g: (a: A) => B,
  ): Kind<URI, E.Either<D, B>>
}

interface Bimap2CPointFree<URI extends URIS2, KE> {
  <E, A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, E.Either<D, B>>
}

interface Bimap2PointFree<URI extends URIS2> {
  <KE, E, A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, E.Either<D, B>>
}

interface BimapPointFree<URI extends URIS> {
  <E, A, D, B>(
    f: (e: E) => D,
    g: (a: A) => B,
  ): (fa: Kind<URI, E.Either<E, A>>) => Kind<URI, E.Either<D, B>>
}

export interface Bimap2C<URI extends URIS2, E>
  extends Bimap2CPointed<URI, E>,
    Bimap2CPointFree<URI, E> {}

export interface Bimap2<URI extends URIS2>
  extends Bimap2Pointed<URI>,
    Bimap2PointFree<URI> {}

export interface Bimap<URI extends URIS>
  extends BimapPointed<URI>,
    BimapPointFree<URI> {}

export function bimap<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Bimap2C<URI, E>
export function bimap<URI extends URIS2>(functor: Functor2<URI>): Bimap2<URI>
export function bimap<URI extends URIS>(functor: Functor<URI>): Bimap<URI>
export function bimap<URI extends URIS>(functor: Functor<URI>): Bimap<URI> {
  const bimapPointed: BimapPointed<URI> = (fma, f, g) =>
    functor.map (fma, E.bimap (f, g))

  return overload (2, bimapPointed)
}
