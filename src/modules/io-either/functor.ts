import * as E from "../either"
import { createFunctor2, Functor2 } from "../../types/Functor"
import { fromIoEither, ioRight, IOEither } from "./io-either"
import { pipe } from "../../utils/pipe"

export const functor: Functor2<"IOEither"> = createFunctor2 ({
  _URI: "IOEither",
  of: ioRight,
  map:
    <_, A, B>(fma: IOEither<_, A>, f: (a: A) => B): IOEither<_, B> =>
    () =>
      pipe (fma, fromIoEither, E.map (f)),
})

export const { of, map } = functor
