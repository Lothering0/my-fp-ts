import { Kind2, URIS2 } from "../../Kind"
import { Either } from "../../../modules/Either"
import { Separated } from "../../../modules/Separated"

export interface Separate2C<URI extends URIS2, E> {
  <A, B>(
    fa: Kind2<URI, E, Either<A, B>>,
  ): Separated<Kind2<URI, E, A>, Kind2<URI, E, B>>
}
