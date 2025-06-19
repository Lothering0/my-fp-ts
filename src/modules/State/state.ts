import { URIS2 } from "../../types/Kind"
import { _ } from "../../utils/underscore"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly State: State<E, A>
  }
}

export interface State<S, A> {
  (s: S): [A, S]
}

export const URI = "State" satisfies URIS2
export type URI = typeof URI
