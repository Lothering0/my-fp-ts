import { URIS2, Kind2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface SetTo2C<URI extends URIS2, E>
  extends SetTo2CPointed<URI, E>,
    SetTo2CPointFree<URI, E> {}

export interface SetTo2CPointed<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    fa: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface SetTo2CPointFree<URI extends URIS2, _> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
