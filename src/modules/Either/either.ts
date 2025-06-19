import { URIS2 } from "../../types/Kind"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly Either: Either<E, A>
  }
}

export type Either<E, A> = Left<E> | Right<A>

export const URI = "Either" satisfies URIS2
export type URI = typeof URI

export interface Left<E> {
  readonly _tag: "Left"
  readonly value: E
}

export interface Right<A> {
  readonly _tag: "Right"
  readonly value: A
}

type LeftConstructor = <E = never, A = never>(e: E) => Either<E, A>
export const left: LeftConstructor = value => ({
  _tag: "Left",
  value,
})

type RightConstructor = <E = never, A = never>(a: A) => Either<E, A>
export const right: RightConstructor = value => ({
  _tag: "Right",
  value,
})
