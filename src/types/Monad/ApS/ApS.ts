import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApS<URI extends URIS>
  extends ApSPointed<URI>,
    ApSPointFree<URI> {}

export interface ApSPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): HKT<URI, DoObject<N, A, B>>
}

export interface ApSPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    fb: HKT<URI, B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}
