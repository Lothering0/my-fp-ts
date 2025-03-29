import { Kind, Kind2, URIS, URIS2 } from "./Kind"

export type HKT<URI extends URIS, A> = Kind<A>[URI]
export type HKT2<URI extends URIS2, A, B> = Kind2<A, B>[URI]
