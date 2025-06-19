import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Array: Array<A>
  }
}

export const URI = "Array" satisfies URIS
export type URI = typeof URI
