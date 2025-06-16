import * as E from "../Either"
import { Functor, Functor2, Functor2C } from "../../types/Functor"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"
import { flow } from "../../utils/flow"

export interface Right2C<URI extends URIS2, KE> {
  <A, E = never>(a: A): Kind2<URI, KE, E.Either<E, A>>
}

export interface Right2<URI extends URIS2> {
  <A, KE, E = never>(a: A): Kind2<URI, KE, E.Either<E, A>>
}

export interface Right<URI extends URIS> {
  <A, E = never>(a: A): Kind<URI, E.Either<E, A>>
}

export function right<URI extends URIS2, KE>(
  applicative: Applicative2C<URI, KE>,
): Right2C<URI, KE>
export function right<URI extends URIS2>(
  applicative: Applicative2<URI>,
): Right2<URI>
export function right<URI extends URIS>(
  applicative: Applicative<URI>,
): Right<URI>
export function right<URI extends URIS>(
  applicative: Applicative<URI>,
): Right<URI> {
  return flow (E.right, applicative.of)
}

export interface RightF2C<URI extends URIS2, KE> {
  <A, E = never>(fe: Kind2<URI, KE, A>): Kind2<URI, KE, E.Either<E, A>>
}

export interface RightF2<URI extends URIS2> {
  <A, KE, E = never>(fe: Kind2<URI, KE, A>): Kind2<URI, KE, E.Either<E, A>>
}

export interface RightF<URI extends URIS> {
  <A, E = never>(fe: Kind<URI, A>): Kind<URI, E.Either<E, A>>
}

export function rightF<URI extends URIS2, KE>(
  functor: Functor2C<URI, KE>,
): RightF2C<URI, KE>
export function rightF<URI extends URIS2>(functor: Functor2<URI>): RightF2<URI>
export function rightF<URI extends URIS>(functor: Functor<URI>): RightF<URI>
export function rightF<URI extends URIS>(functor: Functor<URI>): RightF<URI> {
  return functor.map (E.right)
}
