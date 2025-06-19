import * as E from "../Either"
import * as Io from "../Io"
import { URIS2 } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly IoEither: IoEither<E, A>
  }
}

export interface IoEither<E, A> extends Io.Io<E.Either<E, A>> {}

export const URI = "IoEither" satisfies URIS2
export type URI = typeof URI

type LeftConstructor = <E>(e: E) => IoEither<E, never>
export const left: LeftConstructor = e => () => E.left (e)

type RightConstructor = <A>(a: A) => IoEither<never, A>
export const right: RightConstructor = a => () => E.right (a)

type ToIoEither = <E, A>(ma: Io.Io<A>) => IoEither<E, A>
export const toIoEither: ToIoEither = ma => () => tryDo (ma)

type FromIoEither = <E, A>(ma: IoEither<E, A>) => E.Either<E, A>
export const fromIoEither: FromIoEither = <E, A>(ma: IoEither<E, A>) => {
  try {
    return ma ()
  } catch (exception) {
    return E.left (exception)
  }
}
