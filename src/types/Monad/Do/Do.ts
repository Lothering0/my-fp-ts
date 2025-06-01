import { HKT } from "../../HKT"
import { URIS } from "../../Kind"

export type Do<URI extends URIS> = HKT<URI, {}>
