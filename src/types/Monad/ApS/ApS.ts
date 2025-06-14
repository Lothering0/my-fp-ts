import { URIS, Kind } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApS<URI extends URIS>
  extends ApSPointed<URI>,
    ApSPointFree<URI> {}

export interface ApSPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: Kind<URI, A>,
    name: Exclude<N, keyof A>,
    fb: Kind<URI, B>,
  ): Kind<URI, DoObject<N, A, B>>
}

export interface ApSPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: Kind<URI, B>,
  ): (fa: Kind<URI, A>) => Kind<URI, DoObject<N, A, B>>
}
