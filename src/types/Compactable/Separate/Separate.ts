import { HKT } from "../../HKT"
import { URIS } from "../../Kind"
import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"

export interface Separate<URI extends URIS> {
  <E, A>(fa: HKT<URI, Either<E, A>>): Separated<HKT<URI, E>, HKT<URI, A>>
}
