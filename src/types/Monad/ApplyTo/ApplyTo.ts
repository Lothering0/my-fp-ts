import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { DoObject } from "../DoObject"

export interface ApplyTo<URI extends URIS>
  extends ApplyToPointed<URI>,
    ApplyToPointFree<URI> {}

export interface ApplyToPointed<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    fa: HKT<URI, A>,
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): HKT<URI, DoObject<N, A, B>>
}

export interface ApplyToPointFree<URI extends URIS> {
  <N extends string | number | symbol, A, B>(
    name: Exclude<N, keyof A>,
    ff: HKT<URI, (a: A) => B>,
  ): (fa: HKT<URI, A>) => HKT<URI, DoObject<N, A, B>>
}
