import { HKT2 } from "../../HKT"
import { URIS2 } from "../../Kind"

export type Do2C<URI extends URIS2, E> = HKT2<URI, E, {}>
