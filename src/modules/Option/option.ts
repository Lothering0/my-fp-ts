import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Option: Option<A>
  }
}

export type Option<A> = None | Some<A>

export const URI = "Option" satisfies URIS
export type URI = typeof URI

export interface None {
  readonly _tag: "None"
}

export interface Some<A> {
  readonly _tag: "Some"
  readonly value: A
}

type SomeConstructor = <A>(a: A) => Option<A>
export const some: SomeConstructor = value => ({
  _tag: "Some",
  value,
})

export const none: Option<never> = {
  _tag: "None",
}
