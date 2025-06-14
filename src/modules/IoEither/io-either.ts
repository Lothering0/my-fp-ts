import * as E from "../Either"
import * as Io from "../Io"
import { URIS2 } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface URIToKind2<E, A> {
    readonly IoEither: IoEither<E, A>
  }
}

export interface IoEither<E, A> extends Io.Io<E.Either<E, A>> {}

export const _URI = "IoEither" satisfies URIS2

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

type ToUnion = <E, A>(ma: IoEither<E, A>) => Io.Io<E | A>
export const toUnion: ToUnion = mma => () => E.toUnion (mma ())

interface IoEitherEliminatorPointed {
  <E, A, B>(
    mma: IoEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): Io.Io<B>
}

interface IoEitherEliminator extends IoEitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: IoEither<E, A>) => Io.Io<B>
}

const ioEitherPointed: IoEitherEliminatorPointed = (mma, f, g) =>
  pipe (mma, fromIoEither, E.either (f, g), Io.of)

export const ioEither: IoEitherEliminator = overload2 (ioEitherPointed)
