import * as E from "../either"
import { Applicative2, createApplicative2 } from "../../types/Applicative"
import { _URI, right, fromIoEither, IOEither } from "./io-either"
import { pipe } from "../../utils/flow"

export const applicative: Applicative2<typeof _URI> = createApplicative2 ({
  _URI,
  of: right,
  apply:
    <_, A, B>(
      fma: IOEither<_, A>,
      fmf: IOEither<_, (a: A) => B>,
    ): IOEither<_, B> =>
    () =>
      pipe (
        E.Do,
        E.apS ("a", fromIoEither (fma)),
        E.apS ("f", fromIoEither (fmf)),
        E.map (({ a, f }) => f (a)),
      ),
})

export const { of, apply } = applicative
