import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind<A> {
    readonly Tree: Tree<A>
  }
}

export interface Tree<A> {
  readonly value: A
  readonly forest: Forest<A>
}

export type Forest<A> = Tree<A>[]

export const URI = "Tree" satisfies URIS
export type URI = typeof URI
