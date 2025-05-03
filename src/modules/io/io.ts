declare module "../../types/Kind" {
  interface Kind<A> {
    readonly IO: IO<A>
  }
}

export interface IO<A> {
  (): A
}

type IOConstructor = <A>(a: A) => IO<A>
export const io: IOConstructor = a => () => a

type FromIO = <A>(ma: IO<A>) => A
export const fromIo: FromIO = ma => ma ()
