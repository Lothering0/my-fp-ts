import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { overload } from "../../utils/overloads"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"

interface FlatMap2CPointed<URI extends URIS2, KE> {
  <_, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
    f: (a: A) => Kind2<URI, KE, E.Either<_, B>>,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface FlatMap2Pointed<URI extends URIS2> {
  <KE, _, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
    f: (a: A) => Kind2<URI, KE, E.Either<_, B>>,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface FlatMapPointed<URI extends URIS> {
  <_, A, B>(
    fma: Kind<URI, E.Either<_, A>>,
    f: (a: A) => Kind<URI, E.Either<_, B>>,
  ): Kind<URI, E.Either<_, B>>
}

interface FlatMap2CPointFree<URI extends URIS2, KE> {
  <_, A, B>(
    f: (a: A) => Kind2<URI, KE, E.Either<_, B>>,
  ): (fma: Kind2<URI, KE, E.Either<_, A>>) => Kind2<URI, KE, E.Either<_, B>>
}

interface FlatMap2PointFree<URI extends URIS2> {
  <KE, _, A, B>(
    f: (a: A) => Kind2<URI, KE, E.Either<_, B>>,
  ): (fma: Kind2<URI, KE, E.Either<_, A>>) => Kind2<URI, KE, E.Either<_, B>>
}

interface FlatMapPointFree<URI extends URIS> {
  <_, A, B>(
    f: (a: A) => Kind<URI, E.Either<_, B>>,
  ): (fma: Kind<URI, E.Either<_, A>>) => Kind<URI, E.Either<_, B>>
}

export interface FlatMap2C<URI extends URIS2, E>
  extends FlatMap2CPointed<URI, E>,
    FlatMap2CPointFree<URI, E> {}

export interface FlatMap2<URI extends URIS2>
  extends FlatMap2Pointed<URI>,
    FlatMap2PointFree<URI> {}

export interface FlatMap<URI extends URIS>
  extends FlatMapPointed<URI>,
    FlatMapPointFree<URI> {}

export function flatMap<URI extends URIS2, E>(
  monad: Monad2C<URI, E>,
): FlatMap2C<URI, E>
export function flatMap<URI extends URIS2>(monad: Monad2<URI>): FlatMap2<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI>
export function flatMap<URI extends URIS>(monad: Monad<URI>): FlatMap<URI> {
  return overload (
    <_, A, B>(
      fma: Kind<URI, E.Either<_, A>>,
      f: (a: A) => Kind<URI, E.Either<_, B>>,
    ): Kind<URI, E.Either<_, B>> =>
      pipe (
        monad.Do,
        monad.apS ("ma", fma),
        monad.map (({ ma }) => E.map (ma, f)),
        monad.flatMap (E.match (flow (E.left, monad.of), identity)),
      ),
  )
}
