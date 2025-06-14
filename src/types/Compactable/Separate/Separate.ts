import { Kind, URIS } from "../../Kind"
import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"

export interface Separate<URI extends URIS> {
  <E, A>(fa: Kind<URI, Either<E, A>>): Separated<Kind<URI, E>, Kind<URI, A>>
}
