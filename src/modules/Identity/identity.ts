import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Identity: Identity<A>
  }
}

export type Identity<A> = A

export const _URI = "Identity" satisfies URIS

type IdentityConstructor = <A>(a: A) => Identity<A>
export const identity: IdentityConstructor = a => a
