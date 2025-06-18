import * as E from "../Either"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { URI, right, fromIoEither, IoEither } from "./io-either"
import { pipe } from "../../utils/flow"
import { functor } from "./functor"

export const applicative: Applicative2<URI> = createApplicative2 ({
  ...functor,
  of: right,
  apply:
    <_, A, B>(
      fma: IoEither<_, A>,
      fmf: IoEither<_, (a: A) => B>,
    ): IoEither<_, B> =>
    () =>
      pipe (
        E.Do,
        E.apS ("a", fromIoEither (fma)),
        E.apS ("f", fromIoEither (fmf)),
        E.map (({ a, f }) => f (a)),
      ),
})

export const { of, apply, ap } = applicative
