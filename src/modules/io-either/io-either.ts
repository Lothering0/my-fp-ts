import * as E from "../either"
import * as IO from "../io"
import { URIS2 } from "../../types/Kind"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/flow"
import { overload2 } from "../../utils/overloads"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly IOEither: IOEither<E, A>
  }
}

export interface IOEither<E, A> extends IO.IO<E.Either<E, A>> {}

export const _URI = "IOEither" satisfies URIS2

type LeftConstructor = <E>(e: E) => IOEither<E, never>
export const left: LeftConstructor = e => () => E.left (e)

type RightConstructor = <A>(a: A) => IOEither<never, A>
export const right: RightConstructor = a => () => E.right (a)

type ToIOEither = <E, A>(ma: IO.IO<A>) => IOEither<E, A>
export const toIoEither: ToIOEither = ma => () => tryDo (ma)

type FromIOEither = <E, A>(ma: IOEither<E, A>) => E.Either<E, A>
export const fromIoEither: FromIOEither = <E, A>(ma: IOEither<E, A>) => {
  try {
    return ma ()
  } catch (exception) {
    return E.left (exception)
  }
}

type ToUnion = <E, A>(ma: IOEither<E, A>) => IO.IO<E | A>
export const toUnion: ToUnion = mma => () => E.toUnion (mma ())

interface IOEitherEliminatorPointed {
  <E, A, B>(
    mma: IOEither<E, A>,
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): IO.IO<B>
}

interface IOEitherEliminator extends IOEitherEliminatorPointed {
  <E, A, B>(
    whenLeft: (e: E) => B,
    whenRight: (a: A) => B,
  ): (mma: IOEither<E, A>) => IO.IO<B>
}

const ioEitherPointed: IOEitherEliminatorPointed = (mma, f, g) =>
  pipe (mma, fromIoEither, E.either (f, g), IO.of)

export const ioEither: IOEitherEliminator = overload2 (ioEitherPointed)
