import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { overload } from "../../utils/overloads"
import { Monad, Monad2, Monad2C } from "../../types/Monad"
import { flow, pipe } from "../../utils/flow"
import { identity } from "../Identity"

interface Chain2CPointed<URI extends URIS2, KE> {
  <E, A, B>(
    fma: Kind2<URI, KE, E.Either<E, A>>,
    f: (a: A) => Kind2<URI, KE, E.Either<E, B>>,
  ): Kind2<URI, KE, E.Either<E, B>>
}

interface Chain2Pointed<URI extends URIS2> {
  <KE, E, A, B>(
    fma: Kind2<URI, KE, E.Either<E, A>>,
    f: (a: A) => Kind2<URI, KE, E.Either<E, B>>,
  ): Kind2<URI, KE, E.Either<E, B>>
}

interface ChainPointed<URI extends URIS> {
  <E, A, B>(
    fma: Kind<URI, E.Either<E, A>>,
    f: (a: A) => Kind<URI, E.Either<E, B>>,
  ): Kind<URI, E.Either<E, B>>
}

interface Chain2CPointFree<URI extends URIS2, KE> {
  <E, A, B>(
    f: (a: A) => Kind2<URI, KE, E.Either<E, B>>,
  ): (fma: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, E.Either<E, B>>
}

interface Chain2PointFree<URI extends URIS2> {
  <KE, E, A, B>(
    f: (a: A) => Kind2<URI, KE, E.Either<E, B>>,
  ): (fma: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, E.Either<E, B>>
}

interface ChainPointFree<URI extends URIS> {
  <E, A, B>(
    f: (a: A) => Kind<URI, E.Either<E, B>>,
  ): (fma: Kind<URI, E.Either<E, A>>) => Kind<URI, E.Either<E, B>>
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
    <E, A, B>(
      fma: Kind<URI, E.Either<E, A>>,
      f: (a: A) => Kind<URI, E.Either<E, B>>,
    ): Kind<URI, E.Either<E, B>> =>
      pipe (
        monad.Do,
        monad.apS ("ma", fma),
        monad.map (({ ma }) => E.map (ma, f)),
        monad.flatMap (E.match (flow (E.left, monad.of), identity)),
      ),
  )
}
