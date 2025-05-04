import * as E from "../either"
import * as IO from "../io"
import { tryDo } from "../../utils/exceptions"
import { pipe } from "../../utils/pipe"
import { overloadWithPointFree2 } from "../../utils/points"

declare module "../../types/Kind" {
  interface Kind2<E, A> {
    readonly IOEither: IOEither<E, A>
  }
}

export interface IOEither<E, A> extends IO.IO<E.Either<E, A>> {
  (): E.Either<E, A>
}

type IOLeftConstructor = <E>(e: E) => IOEither<E, never>
export const ioLeft: IOLeftConstructor = e => () => E.left (e)

type IORightConstructor = <A>(a: A) => IOEither<never, A>
export const ioRight: IORightConstructor = a => () => E.right (a)

type ToIOEither = <E, A>(ma: IO.IO<A>) => IOEither<E, A>
export const toTaskEither: ToIOEither = ma => () => tryDo (ma)

type FromIOEither = <E, A>(ma: IOEither<E, A>) => E.Either<E, A>
export const fromIoEither: FromIOEither = <E, A>(ma: IOEither<E, A>) => {
  try {
    return ma ()
  } catch (exception) {
    return E.left (exception)
  }
}

type ToIOUnion = <E, A>(ma: IOEither<E, A>) => IO.IO<E | A>
export const toIoUnion: ToIOUnion = mma => () => E.toUnion (mma ())

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
  pipe (mma, fromIoEither, E.either (f, g), IO.pure)

export const ioEither: IOEitherEliminator =
  overloadWithPointFree2 (ioEitherPointed)
