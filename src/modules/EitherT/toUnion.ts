import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../types/Functor"

export interface ToUnion2C<URI extends URIS2, KE> {
  <E, A>(ma: Kind2<URI, KE, E.Either<E, A>>): Kind2<URI, KE, E | A>
}

export interface ToUnion2<URI extends URIS2> {
  <KE, E, A>(ma: Kind2<URI, KE, E.Either<E, A>>): Kind2<URI, KE, E | A>
}

export interface ToUnion<URI extends URIS> {
  <E, A>(ma: Kind<URI, E.Either<E, A>>): Kind<URI, E | A>
}

export function toUnion<URI extends URIS2, KE>(
  functor: Functor2C<URI, KE>,
): ToUnion2C<URI, KE>
export function toUnion<URI extends URIS2>(
  functor: Functor2<URI>,
): ToUnion2<URI>
export function toUnion<URI extends URIS>(functor: Functor<URI>): ToUnion<URI>
export function toUnion<URI extends URIS>(functor: Functor<URI>): ToUnion<URI> {
  return functor.map (E.toUnion)
}
