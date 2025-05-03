import * as E from "../either"
import { Bifunctor, createBifunctor } from "../../types/Bifunctor"
import { IOEither, fromIoEither } from "../io-either"
import { pipe } from "../../utils/pipe"

export const bifunctor: Bifunctor<"IOEither"> = createBifunctor ({
  _URI: "IOEither",
  mapLeft:
    <E, _, B>(fma: IOEither<E, _>, f: (e: E) => B): IOEither<B, _> =>
    () =>
      pipe (fma, fromIoEither, E.mapLeft (f)),
  bimap:
    <E, A, B = E, C = A>(
      fma: IOEither<E, A>,
      f: (e: E) => B,
      g: (a: A) => C,
    ): IOEither<B, C> =>
    () =>
      pipe (fma, fromIoEither, E.bimap (f, g)),
})

export const { mapLeft, bimap } = bifunctor
