import { Kind, Kind2, URIS, URIS2 } from "../../types/Kind"

export interface StateT<URI extends URIS, S, A> {
  (s: S): Kind<URI, [A, S]>
}

export interface StateT2<URI extends URIS2, S, E, A> {
  (s: S): Kind2<URI, E, [A, S]>
}
