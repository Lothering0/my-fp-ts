import { URIS, Kind } from "../../Kind"
import { DoObject } from "../DoObject"

export interface SetTo<URI extends URIS>
  extends SetToPointed<URI>,
    SetToPointFree<URI> {}

export interface SetToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: Kind<URI, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): Kind<URI, DoObject<N, A, B>>
}

export interface SetToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: Kind<URI, A>) => Kind<URI, DoObject<N, A, B>>
}
