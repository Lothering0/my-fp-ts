import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Identity: Identity<A>
  }
}

export type Identity<A> = A

export const URI = "Identity" satisfies URIS
export type URI = typeof URI

type IdentityConstructor = <A>(a: A) => Identity<A>
export const identity: IdentityConstructor = a => a
