import { URIS2, Kind2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface MapTo2C<URI extends URIS2, E>
  extends MapTo2CPointed<URI, E>,
    MapTo2CPointFree<URI, E> {}

export interface MapTo2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    fa: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface MapTo2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    f: (a: A) => B,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
