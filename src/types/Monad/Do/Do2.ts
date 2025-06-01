import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export type Do2<URI extends URIS2> = HKT2<URI, unknown, {}>
