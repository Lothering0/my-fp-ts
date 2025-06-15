import * as O from "../Option"
import {
  Applicative,
  Applicative2,
  Applicative2C,
} from "../../types/Applicative"
import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"

export interface Zero2C<URI extends URIS2, E> {
  <A>(): Kind2<URI, E, O.Option<A>>
}

export interface Zero2<URI extends URIS2> {
  <E, A>(): Kind2<URI, E, O.Option<A>>
}

export interface Zero<URI extends URIS> {
  <A>(): Kind<URI, O.Option<A>>
}

export function zero<URI extends URIS2, E>(
  applicative: Applicative2C<URI, E>,
): Zero2C<URI, E>
export function zero<URI extends URIS2>(
  applicative: Applicative2<URI>,
): Zero2<URI>
export function zero<URI extends URIS>(applicative: Applicative<URI>): Zero<URI>
export function zero<URI extends URIS>(
  applicative: Applicative<URI>,
): Zero<URI> {
  return () => applicative.of (O.none)
}
