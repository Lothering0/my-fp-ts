import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import { overload2 } from "../../utils/overloads"

interface Match2CPointed<URI extends URIS2, KE> {
  <E, A, B>(
    ma: Kind2<URI, KE, E.Either<E, A>>,
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): Kind2<URI, KE, B>
}

interface Match2Pointed<URI extends URIS2> {
  <KE, E, A, B>(
    ma: Kind2<URI, KE, E.Either<E, A>>,
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): Kind2<URI, KE, B>
}

interface MatchPointed<URI extends URIS> {
  <E, A, B>(
    ma: Kind<URI, E.Either<E, A>>,
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): Kind<URI, B>
}

interface Match2CPointFree<URI extends URIS2, KE> {
  <E, A, B>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): (ma: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, B>
}

interface Match2PointFree<URI extends URIS2> {
  <KE, E, A, B>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): (ma: Kind2<URI, KE, E.Either<E, A>>) => Kind2<URI, KE, B>
}

interface MatchPointFree<URI extends URIS> {
  <E, A, B>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
  ): (ma: Kind<URI, E.Either<E, A>>) => Kind<URI, B>
}

export interface Match2C<URI extends URIS2, E>
  extends Match2CPointed<URI, E>,
    Match2CPointFree<URI, E> {}

export interface Match2<URI extends URIS2>
  extends Match2Pointed<URI>,
    Match2PointFree<URI> {}

export interface Match<URI extends URIS>
  extends MatchPointed<URI>,
    MatchPointFree<URI> {}

export function match<URI extends URIS2, KE>(
  functor: Functor2C<URI, KE>,
): Match2C<URI, KE>
export function match<URI extends URIS2>(functor: Functor2<URI>): Match2<URI>
export function match<URI extends URIS>(functor: Functor<URI>): Match<URI>
export function match<URI extends URIS>(functor: Functor<URI>): Match<URI> {
  return overload2 ((mm, onLeft, onRight) =>
    functor.map (mm, E.match (onLeft, onRight)),
  )
}
