import * as E from "../../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../../types/Functor"
import { overload } from "../../../utils/overloads"

interface Map2CPointed<URI extends URIS2, KE> {
  <_, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
    f: (a: A) => B,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface Map2Pointed<URI extends URIS2> {
  <KE, _, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
    f: (a: A) => B,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface MapPointed<URI extends URIS> {
  <_, A, B>(
    fma: Kind<URI, E.Either<_, A>>,
    f: (a: A) => B,
  ): Kind<URI, E.Either<_, B>>
}

interface Map2CPointFree<URI extends URIS2, KE> {
  <_, A, B>(
    f: (a: A) => B,
  ): (fma: Kind2<URI, KE, E.Either<_, A>>) => Kind2<URI, KE, E.Either<_, B>>
}

interface Map2PointFree<URI extends URIS2> {
  <KE, _, A, B>(
    f: (a: A) => B,
  ): (fma: Kind2<URI, KE, E.Either<_, A>>) => Kind2<URI, KE, E.Either<_, B>>
}

interface MapPointFree<URI extends URIS> {
  <_, A, B>(
    f: (a: A) => B,
  ): (fma: Kind<URI, E.Either<_, A>>) => Kind<URI, E.Either<_, B>>
}

export interface Map2C<URI extends URIS2, E>
  extends Map2CPointed<URI, E>,
    Map2CPointFree<URI, E> {}

export interface Map2<URI extends URIS2>
  extends Map2Pointed<URI>,
    Map2PointFree<URI> {}

export interface Map<URI extends URIS>
  extends MapPointed<URI>,
    MapPointFree<URI> {}

export function map<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): Map2C<URI, E>
export function map<URI extends URIS2>(functor: Functor2<URI>): Map2<URI>
export function map<URI extends URIS>(functor: Functor<URI>): Map<URI>
export function map<URI extends URIS>(functor: Functor<URI>): Map<URI> {
  const mapPointed: MapPointed<URI> = (fma, f) => functor.map (fma, E.map (f))

  return overload (1, mapPointed)
}
