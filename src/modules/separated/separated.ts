import { URIS2 } from "../../types/Kind"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly Separated: Separated<E, A>
  }
}

export interface Separated<E, A> {
  readonly left: E
  readonly right: A
}

export const _URI = "Separated" satisfies URIS2

type Left = <E>(fe: Separated<E, unknown>) => E
export const left: Left = fe => fe.left

type Right = <A>(fa: Separated<unknown, A>) => A
export const right: Right = fa => fa.right
