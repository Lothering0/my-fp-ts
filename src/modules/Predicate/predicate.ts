import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Predicate: Predicate<A>
  }
}

export interface Predicate<A> {
  (a: A): boolean
}

export const URI = "Predicate" satisfies URIS
export type URI = typeof URI
