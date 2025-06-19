import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly NonEmptyArray: NonEmptyArray<A>
  }
}

export type NonEmptyArray<A> = [A, ...A[]]

export const URI = "NonEmptyArray" satisfies URIS
export type URI = typeof URI
