import { URIS2, Kind2 } from "../../Kind"
import { DoObject } from "../DoObject"

export interface SetTo2<URI extends URIS2>
  extends SetTo2Pointed<URI>,
    SetTo2PointFree<URI> {}

export interface SetTo2Pointed<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    fa: Kind2<URI, _, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): Kind2<URI, _, DoObject<N, A, B>>
}

export interface SetTo2PointFree<URI extends URIS2> {
  <N extends string | number | symbol, _, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: Kind2<URI, _, A>) => Kind2<URI, _, DoObject<N, A, B>>
}
