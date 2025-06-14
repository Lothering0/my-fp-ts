import { URIS, Kind } from "../../Kind"

export type Do<URI extends URIS> = Kind<URI, {}>
