import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly NonEmptyArray: NonEmptyArray<A>
  }
}

export type NonEmptyArray<A> = [A, ...A[]]

export const _URI = "NonEmptyArray" satisfies URIS

type Head = <A>(as: NonEmptyArray<A>) => A
export const head: Head = as => as.at (0)!

type Init = <A>(as: NonEmptyArray<A>) => A[]
export const init: Init = as => as.slice (0, -1)

type Last = <A>(as: NonEmptyArray<A>) => A
export const last: Last = as => as.at (-1)!

type Tail = <A>(as: NonEmptyArray<A>) => A[]
export const tail: Tail = as => as.slice (1)
