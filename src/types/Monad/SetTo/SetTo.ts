import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { DoObject } from "../DoObject"

export interface SetTo<URI extends URIS>
  extends SetToPointed<URI>,
    SetToPointFree<URI> {}

export interface SetToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    b: B,
  ): HKT<URI, DoObject<N, A, B>>
}

export interface SetToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}
