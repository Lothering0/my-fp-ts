import * as E from "../../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../../types/Functor"
import { overload } from "../../../utils/overloads"

interface MapLeft2CPointed<URI extends URIS2, KE> {
  <E, _, D>(
    fma: Kind2<URI, KE, E.Either<E, _>>,
    f: (e: E) => D,
  ): Kind2<URI, KE, E.Either<D, _>>
}

interface MapLeft2Pointed<URI extends URIS2> {
  <KE, E, _, D>(
    fma: Kind2<URI, KE, E.Either<E, _>>,
    f: (e: E) => D,
  ): Kind2<URI, KE, E.Either<D, _>>
}

interface MapLeftPointed<URI extends URIS> {
  <E, _, D>(
    fma: Kind<URI, E.Either<E, _>>,
    f: (e: E) => D,
  ): Kind<URI, E.Either<D, _>>
}

interface MapLeft2CPointFree<URI extends URIS2, KE> {
  <E, _, D>(
    f: (e: E) => D,
  ): (fma: Kind2<URI, KE, E.Either<E, _>>) => Kind2<URI, KE, E.Either<D, _>>
}

interface MapLeft2PointFree<URI extends URIS2> {
  <KE, E, _, D>(
    f: (e: E) => D,
  ): (fma: Kind2<URI, KE, E.Either<E, _>>) => Kind2<URI, KE, E.Either<D, _>>
}

interface MapLeftPointFree<URI extends URIS> {
  <E, _, D>(
    f: (e: E) => D,
  ): (fma: Kind<URI, E.Either<E, _>>) => Kind<URI, E.Either<D, _>>
}

export interface MapLeft2C<URI extends URIS2, E>
  extends MapLeft2CPointed<URI, E>,
    MapLeft2CPointFree<URI, E> {}

export interface MapLeft2<URI extends URIS2>
  extends MapLeft2Pointed<URI>,
    MapLeft2PointFree<URI> {}

export interface MapLeft<URI extends URIS>
  extends MapLeftPointed<URI>,
    MapLeftPointFree<URI> {}

export function mapLeft<URI extends URIS2, E>(
  functor: Functor2C<URI, E>,
): MapLeft2C<URI, E>
export function mapLeft<URI extends URIS2>(
  functor: Functor2<URI>,
): MapLeft2<URI>
export function mapLeft<URI extends URIS>(functor: Functor<URI>): MapLeft<URI>
export function mapLeft<URI extends URIS>(functor: Functor<URI>): MapLeft<URI> {
  return overload ((fma, f) => functor.map (fma, E.mapLeft (f)))
}
