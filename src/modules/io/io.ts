import { URIS } from "../../types/Kind"

declare module "../../types/Kind" {
  interface Kind<A> {
    readonly IO: IO<A>
  }
}

export interface IO<A> {
  (): A
}

export const _URI = "IO" satisfies URIS

type IOConstructor = <A>(a: A) => IO<A>
export const io: IOConstructor = a => () => a

type FromIO = <A>(ma: IO<A>) => A
export const fromIo: FromIO = ma => ma ()
