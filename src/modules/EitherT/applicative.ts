import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"

interface Ap2CPointed<URI extends URIS2, KE> {
  <_, A, B>(
    fmf: Kind2<URI, KE, E.Either<_, (a: A) => B>>,
    fma: Kind2<URI, KE, E.Either<_, A>>,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface Ap2Pointed<URI extends URIS2> {
  <KE, _, A, B>(
    fmf: Kind2<URI, KE, E.Either<_, (a: A) => B>>,
    fma: Kind2<URI, KE, E.Either<_, A>>,
  ): Kind2<URI, KE, E.Either<_, B>>
}

interface ApPointed<URI extends URIS> {
  <_, A, B>(
    fmf: Kind<URI, E.Either<_, (a: A) => B>>,
    fma: Kind<URI, E.Either<_, A>>,
  ): Kind<URI, E.Either<_, B>>
}

interface Ap2CPointFree<URI extends URIS2, KE> {
  <_, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
  ): (
    fmf: Kind2<URI, KE, E.Either<_, (a: A) => B>>,
  ) => Kind2<URI, KE, E.Either<_, B>>
}

interface Ap2PointFree<URI extends URIS2> {
  <KE, _, A, B>(
    fma: Kind2<URI, KE, E.Either<_, A>>,
  ): (
    fmf: Kind2<URI, KE, E.Either<_, (a: A) => B>>,
  ) => Kind2<URI, KE, E.Either<_, B>>
}

interface ApPointFree<URI extends URIS> {
  <_, A, B>(
    fma: Kind<URI, E.Either<_, A>>,
  ): (fmf: Kind<URI, E.Either<_, (a: A) => B>>) => Kind<URI, E.Either<_, B>>
}

export interface Ap2C<URI extends URIS2, E>
  extends Ap2CPointed<URI, E>,
    Ap2CPointFree<URI, E> {}

export interface Ap2<URI extends URIS2>
  extends Ap2Pointed<URI>,
    Ap2PointFree<URI> {}

export interface Ap<URI extends URIS>
  extends ApPointed<URI>,
    ApPointFree<URI> {}

export function ap<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): Ap2C<URI, E>
export function ap<URI extends URIS2>(applicative: Applicative2<URI>): Ap2<URI>
export function ap<URI extends URIS>(applicative: Applicative<URI>): Ap<URI>
export function ap<URI extends URIS>(applicative: Applicative<URI>): Ap<URI> {
  return overload (
    <E, A, B>(
      fmf: Kind<URI, E.Either<E, (a: A) => B>>,
      fma: Kind<URI, E.Either<E, A>>,
    ) =>
      pipe (
        fmf,
        applicative.map (mf => (mg: E.Either<E, A>) => E.ap (mf, mg)),
        applicative.ap (fma),
      ),
  )
}
