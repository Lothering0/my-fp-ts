import * as E from "../Either"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { Functor, Functor2, Functor2C } from "../../types/Functor"

export interface Swap2C<URI extends URIS2, KE> {
  <E, A>(ma: Kind2<URI, KE, E.Either<E, A>>): Kind2<URI, KE, E.Either<A, E>>
}

export interface Swap2<URI extends URIS2> {
  <KE, E, A>(ma: Kind2<URI, KE, E.Either<E, A>>): Kind2<URI, KE, E.Either<A, E>>
}

export interface Swap<URI extends URIS> {
  <E, A>(ma: Kind<URI, E.Either<E, A>>): Kind<URI, E.Either<A, E>>
}

export function swap<URI extends URIS2, KE>(
  functor: Functor2C<URI, KE>,
): Swap2C<URI, KE>
export function swap<URI extends URIS2>(functor: Functor2<URI>): Swap2<URI>
export function swap<URI extends URIS>(functor: Functor<URI>): Swap<URI>
export function swap<URI extends URIS>(functor: Functor<URI>): Swap<URI> {
  return functor.map (E.swap)
}
